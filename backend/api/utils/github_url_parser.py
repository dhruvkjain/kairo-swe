import re
from fastapi import HTTPException

def _parse_github_url(url: str) -> tuple[str, str]:
    match = re.search(r"github\.com/([\w\-\.]+)/([\w\-\.]+)", url)
    if not match:
        raise HTTPException(400, "Invalid GitHub URL format.")

    owner, repo_name = match.groups()
    repo_name = repo_name.removesuffix(".git")
    return owner, repo_name