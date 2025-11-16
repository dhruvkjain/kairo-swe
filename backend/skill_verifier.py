import os
import re
import base64
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from fastapi.concurrency import run_in_threadpool
from github import Github, GithubException
import google.generativeai as genai
from dotenv import load_dotenv

# --- Config and Router Setup ---
load_dotenv()
router = APIRouter()

GITHUB_TOKEN = os.getenv("GITHUB_API_TOKEN")
if not GITHUB_TOKEN:
    raise EnvironmentError("GITHUB_API_TOKEN not found in .env file")

g = Github(GITHUB_TOKEN)

# --- Pydantic Models (UPDATED) ---

class SkillMastery(BaseModel):
    """Defines the AI's analysis of a single skill."""
    skill: str = Field(..., description="The name of the verified skill (e.g., 'Python', 'React').")
    mastery_level: float = Field(..., description="A 0-10 score of proficiency based on the code.", ge=0.0, le=10.0)
    evidence: str = Field(..., description="A 1-sentence justification for the score, citing evidence from the code.")

class VerificationResponse(BaseModel):
    """Defines the JSON response for a verified project."""
    project_level: str  # e.g., "Beginner", "Intermediate", "Advanced"
    verified_skills: list[SkillMastery] # <-- This line is UPDATED
    analysis: str       # The AI's 2-3 sentence summary
    code_quality_score: float # Score from 0.0 to 10.0

class RepoUrlRequest(BaseModel):
    """Defines the request body, expects a 'url' field."""
    url: str

def _parse_github_url(url: str) -> tuple[str, str]:
    """Extracts 'owner/repo' from various GitHub URL formats."""
    match = re.search(r"github\.com/([\w\-\.]+)/([\w\-\.]+)", url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL format.")
    
    owner, repo_name = match.groups()
    repo_name = repo_name.removesuffix('.git')    
    return owner, repo_name

# --- The AI "High-End" Prompt (UPDATED) ---
def _get_code_review_prompt(code_context: str) -> str:
    """
    Creates the prompt for the Gemini AI Technical Reviewer,
    asking for the 0-10 mastery score.
    """
    # This prompt is now much more detailed, as per your suggestion.
    return f"""
    [INST]
    You are a Senior Software Engineer and a strict, high-standards technical reviewer.
    A student has submitted their codebase for analysis. The codebase is provided below,
    with each file clearly marked by "--- FILE: [path] ---".

    **Your Task:**
    Analyze the entire project and return a JSON object with the following:
    
    1.  **project_level**: (string) "Beginner", "Intermediate", or "Advanced".
        - **Beginner:** Single-file scripts, "tutorial" projects, basic concepts.
        - **Intermediate:** Multi-file projects, uses a framework (like Flask/React), shows basic structure (e.g., utils/routes), includes a `README.md`.
        - **Advanced:** Complex structure (e.g., microservices, monorepo), uses databases, authentication, automated tests, or advanced libraries (e.g., TensorFlow, Docker).

    2.  **verified_skills**: (list[object]) A list of skill objects.
        - **skill**: (string) The name of the skill.
        - **mastery_level**: (float) A 0-10 score of proficiency. (1.0 = basic syntax, 5.0 = standard usage, 8.0+ = advanced/idiomatic use).
        - **evidence**: (string) A 1-sentence justification for the score, citing file(s).
        - *Example: {{"skill": "Python", "mastery_level": 8.5, "evidence": "Demonstrates advanced async patterns in `main.py`."}}*

    3.  **analysis**: (string) A 2-3 sentence summary of the project's
        quality, what it does, and what it demonstrates.

    4.  **code_quality_score**: (float) A single score from 0.0 to 10.0
        representing the *quality* of the code (e.g., readability, structure,
        error handling, not just if it works).

    **Codebase to Analyze:**
    ---
    {code_context}
    ---

    **Your Response:**
    Return *only* the valid JSON object in the exact format requested.
    Do not add any other text or markdown.
    [/INST]
    """

# --- The "Busboy" Function (UPDATED) ---
def _verify_repo_blocking_tasks(repo_url: str) -> dict:
    """
    Runs all blocking I/O (GitHub API) and AI (Gemini) tasks.
    This is designed to be run in a threadpool.
    """
    try:
        # 1. Parse URL and get repo object
        owner, repo_name = _parse_github_url(repo_url)
        repo = g.get_repo(f"{owner}/{repo_name}")
        
        all_code_context = ""
        files_to_fetch = []
        
        # --- Priority File Fetching (UPDATED LOGIC) ---
        
        # 2A. Always fetch metadata files
        metadata_files = ["README.md", "requirements.txt", "package.json", "pom.xml", "build.gradle"]
        for file_path in metadata_files:
            try:
                file_content = repo.get_contents(file_path)
                decoded_content = base64.b64decode(file_content.content).decode('utf-8')
                all_code_context += f"\n\n--- FILE: {file_path} ---\n{decoded_content}"
            except GithubException:
                pass # File not found, which is fine

        # 2B. Fetch Code Files with "Priority File" logic
        tree = repo.get_git_tree(repo.default_branch, recursive=True)
        
        # This list now guarantees we find the most important files
        priority_files = [
            'main.py', 'app.py', 'server.py', 'index.py',
            'main.js', 'app.js', 'server.js', 'index.js',
            'main.ts', 'app.ts', 'server.ts', 'index.ts',
            'main.go', 'main.java'
        ]
        
        source_files = [
            f.path for f in tree.tree
            if f.type == 'blob' 
            and f.path.endswith(('.py', '.js', '.ts', '.java', '.go'))
            and 'node_modules/' not in f.path
            and 'test' not in f.path.lower()
            and '__init__.py' not in f.path
            and '.venv/' not in f.path
        ]
        
        # Separate into priority and other files
        priority_files_found = [f for f in source_files if os.path.basename(f) in priority_files]
        other_files = [f for f in source_files if f not in priority_files_found]
        
        # Limit to 10 files total, prioritizing the "main" files
        files_to_fetch = priority_files_found
        remaining_slots = 10 - len(files_to_fetch)
        if remaining_slots > 0:
            files_to_fetch.extend(other_files[:remaining_slots])
        
        # 2C. Fetch the content of the selected code files
        for file_path in files_to_fetch:
            try:
                file_content = repo.get_contents(file_path)
                decoded_content = base64.b64decode(file_content.content).decode('utf-8')
                all_code_context += f"\n\n--- FILE: {file_path} ---\n{decoded_content}"
            except Exception:
                pass # File might be too large, binary, or other issue

        # --- End of Updated Logic ---

        if not all_code_context.strip():
            raise HTTPException(status_code=400, detail="This repository is empty or has no readable code.")

        # 3. Call Gemini 1.5 Pro (The AI Engine)
        prompt = _get_code_review_prompt(all_code_context)
        
        model = genai.GenerativeModel('gemini-2.5-pro') 
        
        gemini_response = model.generate_content(prompt)
        
        # Clean the response to get *only* the JSON
        response_text = gemini_response.text.strip().replace("```json\n", "").replace("\n```", "")
        
        parsed_json = json.loads(response_text)
        
        # We must validate the Pydantic model *here* to be safe
        # This ensures the AI followed our new, complex instructions
        try:
            VerificationResponse(**parsed_json)
        except Exception as pydantic_error:
            raise HTTPException(status_code=500, detail=f"AI returned data in an invalid format: {pydantic_error}")
        
        return parsed_json

    except GithubException as e:
        if e.status == 404:
            raise HTTPException(status_code=404, detail="GitHub repository not found.")
        raise HTTPException(status_code=500, detail=f"GitHub API error: {e.data}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned an invalid JSON response.")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


# --- API Endpoint (The "Waiter") ---
@router.post("/verify-repo", response_model=VerificationResponse)
async def handle_skill_verification(request: RepoUrlRequest):
    return await run_in_threadpool(
        _verify_repo_blocking_tasks, repo_url=request.url
    )