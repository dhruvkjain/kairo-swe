import os
import psycopg2
from psycopg2.extras import DictCursor
from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import re
from fastapi import HTTPException, APIRouter, Query, Depends
from fastapi.concurrency import run_in_threadpool

# --- Database Connection ---
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise EnvironmentError("DATABASE_URL (from .env) not found. Please add it.")

# --- Pydantic Models (Modified to match DB schema) ---
class VerifiedSkill(BaseModel):
    skill: str = Field(..., alias="skillName") # 'alias' matches the DB column
    mastery_level: float = Field(..., alias="masteryLevel")
    
    class Config:
        allow_population_by_field_name = True # Allows using the 'alias'

class JobDetails(BaseModel):
    """Pydantic model for the Internship data from the DB"""
    id: str # Job ID is a UUID (string)
    description: str # Use 'description' from Internship model
    required_skills: List[str] = Field(..., alias="skillsRequired")
    preferred_skills: List[str] = Field(default_factory=list, alias="perks") # Using perks as preferred
    
    class Config:
        allow_population_by_field_name = True

class ApplicantProfile(BaseModel):
    """Pydantic model for the Applicant data from the DB"""
    id: str # This is the Applicant ID
    name: str
    raw_resume_text: str = Field(..., alias="rawResumeText")
    ocr_skills: List[str] = Field(default_factory=list) 
    ocr_projects_text: str = Field(default_factory=str, alias="resumeProjectText")
    verified_skills_data: List[VerifiedSkill] = Field(default_factory=list)
    best_project_level: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True

class ApplicantScore(BaseModel):
    applicant_id: str
    name: str
    final_score: float
    breakdown: Dict[str, float]

# --- AI Model Loading (Unchanged) ---
model: Optional[SentenceTransformer] = None
def load_model():
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

# --- Default Weights (Unchanged) ---
DEFAULT_WEIGHTS = {
    "verified_mastery": 0.30, "experience_match": 0.25, "ocr_skills": 0.10,
    "project_level": 0.15, "bonus_skills": 0.10, "project_relevance": 0.10
}

# --- Helper Function (Unchanged) ---
def normalize_skill(skill: str) -> str:
    skill_lower = skill.lower().strip()
    skill_lower = re.sub(r'[\.\s]', '', skill_lower)
    return skill_lower

# --- Core Calculation Logic (This function is unchanged) ---
def calculate_shortlist(
    job: JobDetails, 
    applicants: List[ApplicantProfile], 
    custom_weights: Optional[Dict[str, float]] = None
) -> List[ApplicantScore]:
    
    if model is None:
        print("ERROR:     Model not loaded. Server is still starting.")
        raise HTTPException(status_code=503, detail="Server is still loading AI model. Please try again in 30 seconds.")

    weights = custom_weights if custom_weights else DEFAULT_WEIGHTS
    scored_applicants = []
    # Use 'description' from Internship model for semantic match
    job_resp_embedding = model.encode(job.description if job.description else "", convert_to_tensor=True)
    job_req_skills_norm = {normalize_skill(s) for s in job.required_skills}
    job_pref_skills_norm = {normalize_skill(s) for s in job.preferred_skills}

    project_level_map = {"Beginner": 30, "Intermediate": 60, "Advanced": 90}

    for applicant in applicants:
        app_skills_norm = {normalize_skill(s) for s in applicant.ocr_skills}

        # Score 1: OCR Skills (from resume)
        score_ocr_skills = 0.0
        if not job_req_skills_norm: score_ocr_skills = 100.0
        else:
            found_skills = job_req_skills_norm.intersection(app_skills_norm)
            score_ocr_skills = (len(found_skills) / len(job_req_skills_norm)) * 100.0

        # Score 2: Experience Match (Semantic resume vs. job)
        resume_embedding = model.encode(applicant.raw_resume_text if applicant.raw_resume_text else "", convert_to_tensor=True)
        exp_similarity = util.cos_sim(job_resp_embedding, resume_embedding)
        score_experience_match = max(0, exp_similarity.item()) * 100.0
        
        # Score 3: Bonus Skills (Preferred skills)
        score_bonus_skills = 0.0
        if not job_pref_skills_norm: score_bonus_skills = 0.0
        else:
            found_bonus_skills = job_pref_skills_norm.intersection(app_skills_norm)
            score_bonus_skills = (len(found_bonus_skills) / len(job_pref_skills_norm)) * 100.0
            
        # Score 4: Project Relevance (Semantic project desc. vs. job)
        project_embedding = model.encode(applicant.ocr_projects_text if applicant.ocr_projects_text else "", convert_to_tensor=True)
        project_similarity = util.cos_sim(job_resp_embedding, project_embedding)
        score_project_relevance = max(0, project_similarity.item()) * 100.0

        # Score 5: Verified Mastery (from GitHub projects)
        score_verified_mastery = 0.0
        if not job_req_skills_norm: score_verified_mastery = 100.0 
        elif not applicant.verified_skills_data: score_verified_mastery = 0.0 
        else:
            app_verified_map = {
                normalize_skill(v.skill): v.mastery_level
                for v in applicant.verified_skills_data
            }
            total_mastery_score = 0.0
            for req_skill in job_req_skills_norm:
                mastery = app_verified_map.get(req_skill, 0.0)
                total_mastery_score += mastery
            max_possible_score = len(job_req_skills_norm) * 10
            if max_possible_score > 0:
                score_verified_mastery = (total_mastery_score / max_possible_score) * 100.0
            else: score_verified_mastery = 100.0

        # Score 6: Project Level (Beginner/Intermediate/Advanced)
        score_project_level = 0.0
        if applicant.best_project_level and applicant.best_project_level in project_level_map:
            score_project_level = project_level_map[applicant.best_project_level]

        # Final Weighted Score
        final_score = (
            (score_verified_mastery * weights["verified_mastery"]) +
            (score_experience_match * weights["experience_match"]) +
            (score_ocr_skills * weights["ocr_skills"]) +
            (score_project_level * weights["project_level"]) +
            (score_bonus_skills * weights["bonus_skills"]) +
            (score_project_relevance * weights["project_relevance"])
        )
        
        scored_applicants.append(
            ApplicantScore(
                applicant_id=applicant.id, name=applicant.name,
                final_score=round(final_score, 2),
                breakdown={
                    "verified_mastery_score": round(score_verified_mastery, 2),
                    "experience_match_score": round(score_experience_match, 2),
                    "required_skills_score_ocr": round(score_ocr_skills, 2),
                    "project_level_score": round(score_project_level, 2),
                    "bonus_skills_score": round(score_bonus_skills, 2),
                    "project_relevance_score": round(score_project_relevance, 2)
                }
            )
        )
    # Return the list, sorted highest-to-lowest score
    return sorted(scored_applicants, key=lambda x: x.final_score, reverse=True)

# --- Main Logic Function (REPLACES FAKE_DB) ---
def get_shortlist_logic(
    job_id: str, # Job ID is a UUID string now
    weights: Dict[str, float]
) -> List[ApplicantScore]:
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=DictCursor)
    cursor = conn.cursor()

    # --- 1. Get Job Data from DB ---
    # Fetch the job's details from the Internship table
    cursor.execute('SELECT id, description, "skillsRequired", perks FROM "Internship" WHERE id = %s', (job_id,))
    db_job = cursor.fetchone()
    if not db_job:
        raise HTTPException(status_code=404, detail="Internship not found")
    # Validate data against our Pydantic model
    job_data = JobDetails(**db_job)

    # --- 2. Get Applicant Data from DB ---
    
    # Get all User IDs who applied for this job
    # We join Applicant -> User -> InternshipApplication
    cursor.execute(
        """
        SELECT T1.id, T2.name, T1."rawResumeText", T1."resumeProjectText"
        FROM "Applicant" AS T1
        INNER JOIN "User" AS T2 ON T1."userId" = T2.id
        INNER JOIN "InternshipApplication" AS T3 ON T2.id = T3."applicantId"
        WHERE T3."internshipId" = %s
        """,
        (job_id,)
    )
    db_applicants = cursor.fetchall()
    
    if not db_applicants:
        return [] # No applicants for this job
    
    applicant_profiles = []
    
    level_map = {"Advanced": 3, "Intermediate": 2, "Beginner": 1, None: 0}
    inv_level_map = {3: "Advanced", 2: "Intermediate", 1: "Beginner", 0: None}
    
    for app_row in db_applicants:
        if not app_row['rawResumeText']: continue # Skip if no resume

        applicant_id = app_row['id']
        
        # Get all "claimed" skills
        cursor.execute('SELECT name FROM "Skill" WHERE "applicantId" = %s', (applicant_id,))
        ocr_skills = [row['name'] for row in cursor.fetchall()]
        
        # Get all "verified" skills
        cursor.execute('SELECT "skillName", "masteryLevel" FROM "VerifiedSkill" WHERE "applicantId" = %s', (applicant_id,))
        # Use Pydantic model to load data, handling the 'alias'
        verified_skills_data = [VerifiedSkill(**row) for row in cursor.fetchall()]
        
        # Get all project levels to find the best one
        cursor.execute('SELECT "projectLevel" FROM "Project" WHERE "applicantId" = %s', (applicant_id,))
        levels = [row['projectLevel'] for row in cursor.fetchall()]
        best_level_num = 0
        if levels:
            best_level_num = max(level_map.get(lvl, 0) for lvl in levels)
        
        # Build the final profile object for the calculator
        applicant_profiles.append(
            ApplicantProfile(
                id=applicant_id,
                name=app_row['name'],
                rawResumeText=app_row['rawResumeText'],
                ocr_skills=ocr_skills,
                resumeProjectText=app_row['resumeProjectText'] or "",
                verified_skills_data=verified_skills_data,
                best_project_level=inv_level_map[best_level_num]
            )
        )

    cursor.close()
    conn.close()

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

# --- API ROUTER (MODIFIED) ---
router = APIRouter()

# This endpoint is now /api/v1/internships/...
@router.get("/internships/{job_id}/shortlist", response_model=List[ApplicantScore])
async def get_ai_shortlist(
    job_id: str, # Changed to str for UUID
    # Define the 6 weights as query parameters
    weight_verified_mastery: float = Query(0.35, ge=0, le=1),
    weight_experience_match: float = Query(0.25, ge=0, le=1),
    weight_ocr_skills: float = Query(0.15, ge=0, le=1),
    weight_project_level: float = Query(0.10, ge=0, le=1),
    weight_bonus_skills: float = Query(0.10, ge=0, le=1),
    weight_project_relevance: float = Query(0.05, ge=0, le=1)
):  
    # --- 1. Validation: Ensure weights sum to 1.0 ---
    total_weight = (
        weight_verified_mastery + weight_experience_match + weight_ocr_skills +
        weight_project_level + weight_bonus_skills + weight_project_relevance
    )
    
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(
            status_code=400,  
            detail=f"Weights must sum to 1.0, but received: {total_weight}"
        )
    
    # --- 2. Create Weights Dictionary ---
    weights = {
        "verified_mastery": weight_verified_mastery, "experience_match": weight_experience_match,
        "ocr_skills": weight_ocr_skills, "project_level": weight_project_level,
        "bonus_skills": weight_bonus_skills, "project_relevance": weight_project_relevance
    }

    # --- 3. Call the Logic Function (in a threadpool) ---
    return await run_in_threadpool(
        get_shortlist_logic, 
        job_id=job_id,       
        weights=weights
    )