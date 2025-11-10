"""
AI Shortlister Module (Four-Component Model)

This file contains all the core logic for:
1. Pydantic Models
2. AI Model Loading (via a function)
3. FAKE_DB (for testing)
4. The main logic function (get_shortlist_logic)
5. The core AI calculation (calculate_shortlist)
6. The API Endpoint Router
"""

from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import re
from fastapi import HTTPException, APIRouter, Query, Depends
from fastapi.concurrency import run_in_threadpool

# --- 1. Pydantic Models ---
class JobDetails(BaseModel):
    """Structured data for a single job posting."""
    responsibilities: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)

class ApplicantProfile(BaseModel):
    """Structured data for a single applicant."""
    id: int
    name: str
    raw_resume_text: str 
    ocr_skills: List[str] = Field(default_factory=list) 
    ocr_projects_text: str = Field(default_factory=str) 

class ApplicantScore(BaseModel):
    """The final output for a single scored applicant."""
    applicant_id: int
    name: str
    final_score: float
    breakdown: Dict[str, float]

# --- 2. AI Model Loading---
model: Optional[SentenceTransformer] = None

def load_model():
    """
    This function is called by main.py's lifespan event
    to load the heavy AI model BEFORE the server starts.
    """
    global model
    if model is None:
        print("INFO:     Server starting up...")
        print("INFO:     Loading semantic model (all-mpnet-base-v2)...")
        try:
            model = SentenceTransformer('all-mpnet-base-v2')
            print("INFO:     Semantic model loaded successfully.")
        except Exception as e:
            print(f"FATAL:     Could not load sentence transformer model: {e}")
    else:
        print("INFO:     Model already loaded.")


# --- 3. Default Weights ---
DEFAULT_WEIGHTS = {
    "skills": 0.4,
    "experience": 0.3,
    "projects": 0.2,
    "bonus": 0.1
}

# --- 4. Helper Function for Skill Normalization ---
def normalize_skill(skill: str) -> str:
    """
    Cleans up skill strings for better matching.
    e.g., "   Python " -> "python"
    e.g., "React.js" -> "react"
    """
    skill_lower = skill.lower().strip()
    skill_lower = re.sub(r'[\.\s]', '', skill_lower)
    return skill_lower

# --- 5. FAKE DATABASE ---
FAKE_DB_JOBS = {
    1: {
        "id": 1,
        "title": "Backend Python Developer",
        "responsibilities": "Build and maintain scalable FastAPI applications...",
        "required_skills": ["Python", "FastAPI", "SQL"],
        "preferred_skills": ["Redis", "Docker", "AWS"]
    },
    2: {
        "id": 2,
        "title": "Senior React Developer",
        "responsibilities": "Develop responsive and complex user interfaces...",
        "required_skills": ["JavaScript", "React", "Next.js", "State Management"],
        "preferred_skills": ["TypeScript", "Testing"]
    }
}

FAKE_DB_APPLICANTS = [
    {
        "id": 101,
        "name": "Alice Smith (Perfect Python Match)",
        "raw_resume_text": "I am a senior Python developer...",
        "ocr_skills": ["Python", "FastAPI", "SQL", "Docker", "AWS", "PostgreSQL"],
        "ocr_projects_text": "Project A: Built a high-traffic e-commerce backend...",
        "applied_jobs": [1]
    },
    {
        "id": 102,
        "name": "Bob Johnson (Good Experience, Missing Skills)",
        "raw_resume_text": "Experienced software engineer...",
        "ocr_skills": ["Python", "Leadership", "Microservices", "Teamwork"],
        "ocr_projects_text": "Project: Internal management tool...",
        "applied_jobs": [1]
    },
    {
        "id": 103,
        "name": "Charlie Brown (Frontend Dev)",
        "raw_resume_text": "I love building user interfaces...",
        "ocr_skills": ["React", "Next.js", "JavaScript", "CSS"],
        "ocr_projects_text": "Project: My portfolio website...",
        "applied_jobs": [1, 2]
    },
    {
        "id": 104,
        "name": "David Lee (Perfect Frontend Match)",
        "raw_resume_text": "Skilled frontend engineer...",
        "ocr_skills": ["React", "Next.js", "JavaScript", "TypeScript", "Redux", "Testing"],
        "ocr_projects_text": "Project 1: Enterprise-level dashboard...",
        "applied_jobs": [2]
    }
]

# --- 6. Core Calculation Logic (CPU-Bound) ---
def calculate_shortlist(
    job: JobDetails, 
    applicants: List[ApplicantProfile], 
    custom_weights: Optional[Dict[str, float]] = None
) -> List[ApplicantScore]:
    
    # If the model isn't loaded yet, tell the user to wait.
    if model is None:
        print("ERROR:     Model not loaded. Server is still starting.")
        # 503 Service Unavailable
        raise HTTPException(status_code=503, detail="Server is still loading AI model. Please try again in 30 seconds.")

    weights = custom_weights if custom_weights else DEFAULT_WEIGHTS
    
    scored_applicants = []
    job_resp_embedding = model.encode(job.responsibilities if job.responsibilities else "", convert_to_tensor=True)
    job_req_skills_norm = {normalize_skill(s) for s in job.required_skills}
    job_pref_skills_norm = {normalize_skill(s) for s in job.preferred_skills}

    for applicant in applicants:
        app_skills_norm = {normalize_skill(s) for s in applicant.ocr_skills}

        # --- Score 1: Required Skills (0-100) ---
        score_skills = 0.0
        if not job_req_skills_norm:
            score_skills = 100.0
        else:
            found_skills = job_req_skills_norm.intersection(app_skills_norm)
            score_skills = (len(found_skills) / len(job_req_skills_norm)) * 100.0

        # --- Score 2: Semantic Experience (0-100) ---
        score_experience = 0.0
        resume_embedding = model.encode(applicant.raw_resume_text if applicant.raw_resume_text else "", convert_to_tensor=True)
        exp_similarity = util.cos_sim(job_resp_embedding, resume_embedding)
        score_experience = max(0, exp_similarity.item()) * 100.0
        
        # --- Score 3: Preferred/Bonus Skills (0-100) ---
        score_bonus = 0.0
        if not job_pref_skills_norm:
            score_bonus = 0.0
        else:
            found_bonus_skills = job_pref_skills_norm.intersection(app_skills_norm)
            score_bonus = (len(found_bonus_skills) / len(job_pref_skills_norm)) * 100.0
            
        # --- Score 4: Semantic Project Relevance (0-100) ---
        score_projects = 0.0
        project_embedding = model.encode(applicant.ocr_projects_text if applicant.ocr_projects_text else "", convert_to_tensor=True)
        project_similarity = util.cos_sim(job_resp_embedding, project_embedding)
        score_projects = max(0, project_similarity.item()) * 100.0

        # --- Final Weighted Score ---
        final_score = (
            (score_skills * weights["skills"]) +
            (score_experience * weights["experience"]) +
            (score_projects * weights["projects"]) +
            (score_bonus * weights["bonus"])
        )
        
        scored_applicants.append(
            ApplicantScore(
                applicant_id=applicant.id,
                name=applicant.name,
                final_score=round(final_score, 2),
                breakdown={
                    "required_skills_score": round(score_skills, 2),
                    "experience_match_score": round(score_experience, 2),
                    "project_relevance_score": round(score_projects, 2),
                    "bonus_skills_score": round(score_bonus, 2)
                }
            )
        )

    sorted_list = sorted(scored_applicants, key=lambda x: x.final_score, reverse=True)
    return sorted_list


# --- 7. Main Logic Function (Synchronous) ---
def get_shortlist_logic(
    job_id: int, 
    weights: Dict[str, float]
) -> List[ApplicantScore]:
    
    # --- 1. Get Job Data from DB ---
    # !!! REPLACE THIS with your real Supabase/Prisma query !!!
    db_job = FAKE_DB_JOBS.get(job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Validate and structure the job data
    try:
        job_data = JobDetails(**db_job)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job data is malformed: {e}")

    # --- 2. Get Applicant Data from DB ---
    # !!! REPLACE THIS with your real Supabase/Prisma query !!!
    db_applicants = [
        app for app in FAKE_DB_APPLICANTS if job_id in app["applied_jobs"]
    ]
    
    applicant_profiles = []
    for app in db_applicants:
        if app.get("raw_resume_text"):
            applicant_profiles.append(
                ApplicantProfile(
                    id=app["id"],
                    name=app["name"],
                    raw_resume_text=app["raw_resume_text"],
                    ocr_skills=app.get("ocr_skills", []), 
                    ocr_projects_text=app.get("ocr_projects_text", "")
                )
            )

    if not applicant_profiles:
        return [] 

    # --- 3. Run the AI Calculation ---
    print(f"INFO:     Calculating shortlist for job {job_id} with weights: {weights}")
    
    shortlist = calculate_shortlist(
        job=job_data, 
        applicants=applicant_profiles,
        custom_weights=weights
    )
    
    return shortlist


# --- 8. API ROUTER (This is the new/moved code) ---
# Create a router to hold all endpoints for this module
router = APIRouter()

@router.get("/jobs/{job_id}/shortlist", response_model=List[ApplicantScore])
async def get_ai_shortlist(
    job_id: int,
    # Define the weights as optional query parameters
    weight_skills: float = Query(0.4, ge=0, le=1),
    weight_experience: float = Query(0.3, ge=0, le=1),
    weight_projects: float = Query(0.2, ge=0, le=1),
    weight_bonus: float = Query(0.1, ge=0, le=1)
):  
    # --- 1. Validation: Ensure weights sum to 1.0 ---
    total_weight = weight_skills + weight_experience + weight_projects + weight_bonus
    # Use a small tolerance for floating point math
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(
            status_code=400,  
            detail=f"Weights must sum to 1.0, but received: {total_weight}"
        )
    
    weights = {
        "skills": weight_skills,
        "experience": weight_experience,
        "projects": weight_projects,
        "bonus": weight_bonus
    }

    # --- 2. Call the Logic Function ---
    # OLD, BLOCKING WAY:
    # return get_shortlist_logic(job_id=job_id, weights=weights)

    # NEW, NON-BLOCKING (PROFESSIONAL) WAY:
    # We tell FastAPI to run the blocking "get_shortlist_logic" function
    # in a separate thread, and our main waiter "await"s the result.
    # The server is now free to handle other requests.
    return await run_in_threadpool(
        get_shortlist_logic, # The function to run
        job_id=job_id,         # The arguments to pass to it
        weights=weights
    )