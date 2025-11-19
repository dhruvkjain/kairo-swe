import os
import base64
import json
import dspy
from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from github import Github, GithubException
from app.config.config import GITHUB_API_TOKEN, OPEN_ROUTER_API_KEY
from app.models.skill_verifier_models import VerificationResponse, RepoUrlRequest
from app.utils.github_url_parser import _parse_github_url

router = APIRouter()

# -------------------------------
# Environment + GitHub Setup
# -------------------------------
if not GITHUB_API_TOKEN:
    raise EnvironmentError("GITHUB_API_TOKEN not found in .env file")

if not OPEN_ROUTER_API_KEY:
    raise EnvironmentError("OPEN_ROUTER_API_KEY not found")

g = Github(GITHUB_API_TOKEN)

# ----------------------------------------------------------
# DSPy Signature for AI Module
# ----------------------------------------------------------
class ReviewRepo(dspy.Signature):
    """Analyze codebase and return strict JSON."""

    codebase: str = dspy.InputField()
    json_response: str = dspy.OutputField()


review_program = dspy.ChainOfThought(ReviewRepo)


# -------------------------------
# Prompt
# -------------------------------
def _make_review_prompt(code_context: str) -> str:
    return f"""
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

Only output valid JSON.
"""


# -------------------------------
# Blocking GitHub + AI Task
# -------------------------------
def _verify_repo_blocking_tasks(repo_url: str) -> dict:
    try:
        # configuration of DSPy + OpenRouter
        qwen_lm=dspy.LM(
            api_key=OPEN_ROUTER_API_KEY,
            model="openrouter/qwen/qwen3-14b:free",
            api_base="https://openrouter.ai/api/v1"
        )
        dspy.configure(lm=qwen_lm)
        owner, repo_name = _parse_github_url(repo_url)
        repo = g.get_repo(f"{owner}/{repo_name}")

        code_context = ""

        metadata_files = [
            "README.md", "requirements.txt", "package.json", "pom.xml", "build.gradle"
        ]

        for path in metadata_files:
            try:
                f = repo.get_contents(path)
                content = base64.b64decode(f.content).decode("utf-8")
                code_context += f"\n\n--- FILE: {path} ---\n{content}"
            except GithubException:
                pass

        tree = repo.get_git_tree(repo.default_branch, recursive=True)
        source_files = [
            f.path for f in tree.tree
            if f.type == "blob"
            and f.path.endswith((".py", ".js", ".ts", ".java", ".go"))
            and "node_modules" not in f.path
            and ".venv" not in f.path
        ]

        priority = {"main.py", "app.py", "server.py", "index.py",
                    "main.js", "app.js", "server.js", "index.js"}

        priority_files = [p for p in source_files if os.path.basename(p) in priority]
        other_files = [p for p in source_files if p not in priority_files]

        selected = priority_files + other_files[:10 - len(priority_files)]

        for fp in selected:
            try:
                f = repo.get_contents(fp)
                content = base64.b64decode(f.content).decode("utf-8")
                code_context += f"\n\n--- FILE: {fp} ---\n{content}"
            except:
                pass

        if not code_context.strip():
            raise HTTPException(400, "Repository is empty or unreadable.")

        # -----------------------------
        # DSPy Call
        # -----------------------------
        with dspy.context(lm=qwen_lm):
            full_prompt = _make_review_prompt(code_context)
            result = review_program(codebase=full_prompt)
            print(result)
            raw_json = result.json_response.strip()
            parsed = json.loads(raw_json)

            VerificationResponse(**parsed)  # Validate schema

        return parsed

    except json.JSONDecodeError:
        raise HTTPException(500, "AI returned invalid JSON.")
    except GithubException as e:
        raise HTTPException(500, f"GitHub error: {str(e)}")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(500, f"Unexpected error: {str(e)}")


# -------------------------------
# API Endpoint
# -------------------------------
@router.post("/verify-repo", response_model=VerificationResponse)
async def handle_skill_verification(req: RepoUrlRequest):
    return await run_in_threadpool(_verify_repo_blocking_tasks, req.url)
