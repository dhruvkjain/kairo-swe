import os
import re
import base64
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
from github import Github, GithubException
import google.generativeai as genai
from dotenv import load_dotenv

# --- Config and Router Setup ---
# Load .env variables (like GITHUB_TOKEN) from the backend/ root
load_dotenv()
router = APIRouter()

# Load our GitHub token
GITHUB_TOKEN = os.getenv("GITHUB_API_TOKEN")
if not GITHUB_TOKEN:
    # This will stop the server on startup if the key is missing
    raise EnvironmentError("GITHUB_API_TOKEN not found in .env file")

# Initialize the GitHub client
g = Github(GITHUB_TOKEN)

# --- Pydantic Models ---
class RepoUrlRequest(BaseModel):
    """Defines the request body, expects a 'url' field."""
    url: str

class VerificationResponse(BaseModel):
    """Defines the JSON response for a verified project."""
    project_level: str  # e.g., "Beginner", "Intermediate", "Advanced"
    verified_skills: list[str]
    analysis: str       # The AI's 2-3 sentence summary
    code_quality_score: float # Score from 0.0 to 10.0

def _parse_github_url(url: str) -> tuple[str, str]:
    match = re.search(r"github\.com/([\w\-\.]+)/([\w\-\.]+)", url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL format.")
    
    owner, repo_name = match.groups()
    repo_name = repo_name.removesuffix('.git')    
    return owner, repo_name

# --- The AI "High-End" Prompt ---
def _get_code_review_prompt(code_context: str) -> str:
    """
    Creates the prompt for the Gemini AI Technical Reviewer,
    feeding it a string containing the content of multiple files.
    """
    # This prompt asks the AI to act as a senior engineer
    # and to return *only* a JSON object.
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

    2.  **verified_skills**: (list[str]) A list of *all* skills you can *prove*
        the user knows based on the *actual code*.
        - If you see `import pandas as pd`, include "Pandas".
        - If you see `app = Flask()`, include "Flask" and "API Development".
        - If you see `pytest` files, include "Pytest" and "Software Testing".
        - Be specific: "React" not just "JavaScript".

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
    Return *only* the valid JSON object. Do not add any other text or markdown.
    [/INST]
    """

# --- The "Busboy" Function (All blocking tasks) ---
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
        
        # 2. Fetch Metadata Files (README, requirements, etc.)
        metadata_files = ["README.md", "requirements.txt", "package.json", "pom.xml", "build.gradle"]
        for file_path in metadata_files:
            try:
                file_content = repo.get_contents(file_path)
                # Content from GitHub API is base64 encoded, so we must decode it
                decoded_content = base64.b64decode(file_content.content).decode('utf-8')
                all_code_context += f"\n\n--- FILE: {file_path} ---\n{decoded_content}"
            except GithubException:
                pass # File not found, which is fine

        # 3. Fetch Code Files (Smart Sampling)
        # Get a list of *all* files in the repo, recursively
        tree = repo.get_git_tree(repo.default_branch, recursive=True)
        
        # Filter for important source code files
        source_files = [
            f.path for f in tree.tree
            if f.type == 'blob' 
            and f.path.endswith(('.py', '.js', '.ts', '.java', '.go'))
            and 'node_modules/' not in f.path
            and 'test' not in f.path.lower()
            and '__init__.py' not in f.path
            and '.venv/' not in f.path
        ]
        
        # Limit to the first 10 most relevant files to avoid being too slow
        files_to_fetch = source_files[:10]
        
        for file_path in files_to_fetch:
            try:
                file_content = repo.get_contents(file_path)
                decoded_content = base64.b64decode(file_content.content).decode('utf-8')
                all_code_context += f"\n\n--- FILE: {file_path} ---\n{decoded_content}"
            except Exception:
                pass # File might be too large, binary, or other issue

        if not all_code_context.strip():
            raise HTTPException(status_code=400, detail="This repository is empty or has no readable code.")

        # 4. Call Gemini 1.5 Pro (The AI Engine)
        prompt = _get_code_review_prompt(all_code_context)
        
        # We use 'gemini-1.5-pro-latest' for the best analysis
        model = genai.GenerativeModel('gemini-2.5-pro') 
        
        # We use the SYNCHRONOUS `generate_content` because
        # this whole function is *already* running in a threadpool.
        gemini_response = model.generate_content(prompt)
        
        # Clean the response to get *only* the JSON
        response_text = gemini_response.text.strip().replace("```json\n", "").replace("\n```", "")
        
        parsed_json = json.loads(response_text)
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
    """
    This endpoint verifies skills from a GitHub repo by performing
    a full (but sampled) code review with GenAI.
    """
    # Run ALL blocking tasks in the threadpool
    return await run_in_threadpool(
        _verify_repo_blocking_tasks, repo_url=request.url
    )