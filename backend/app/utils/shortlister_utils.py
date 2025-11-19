import re
import psycopg2
from psycopg2.extras import DictCursor
from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Callable
from fastapi import HTTPException
from dspy_models import ProjectLevelAssessor # Import the dspy module
from app.config.config import DATABASE_URL

# --- Pydantic Models ---
class VerifiedSkill(BaseModel):
    skill: str = Field(..., alias="skillName")
    mastery_level: float = Field(..., alias="masteryLevel")
    
    class Config:
        allow_population_by_field_name = True

class JobDetails(BaseModel):
    id: str
    description: str
    required_skills: List[str] = Field(..., alias="skillsRequired")
    preferred_skills: List[str] = Field(default_factory=list, alias="perks")
    
    class Config:
        allow_population_by_field_name = True

class ApplicantProfile(BaseModel):
    id: str
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

# --- Helper Functions ---
def normalize_skill(skill: str) -> str:
    """Standardizes a skill name for reliable comparison."""
    skill_lower = skill.lower().strip()
    skill_lower = re.sub(r'[\.\s]', '', skill_lower)
    return skill_lower

def get_applicant_project_level(
    project_text: str, 
    db_level: Optional[str],
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: Callable[[Any], None]
) -> Optional[str]:
    """
    Determines the best project level. Runs the dspy LLM model on the project text
    if the DB level is missing. Requires the assessor module and an LLM context manager.
    """
    if db_level:
        return db_level
    
    if not project_text or len(project_text) < 20:
        return "Beginner"

    # Use the provided context manager (which handles dspy.context(lm=...))
    try:
        with llm_context_manager:
            return assessor_module.forward(project_text=project_text)
    except Exception as e:
        # Fallback in case of context manager or LLM failure
        print(f"LLM Assessment failed during threadpool call: {e}. Defaulting to Beginner.")
        return "Beginner"


def get_job_and_applicants(
    job_id: str,
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: Callable[[Any], None]
) -> tuple[JobDetails, List[ApplicantProfile]]:
    """
    Fetches job and applicant data from the database, and performs the LLM
    project assessment step.
    """
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="Database configuration missing.")
        
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=DictCursor)
    cursor = conn.cursor()

    # 1. Get Job Data
    cursor.execute('SELECT id, description, "skillsRequired", perks FROM "Internship" WHERE id = %s', (job_id,))
    db_job = cursor.fetchone()
    if not db_job:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Internship not found")
    job_data = JobDetails(**dict(db_job))

    # 2. Get Applicant Data
    cursor.execute(
        """
        SELECT 
            T1.id, T2.name, T1."rawResumeText", T1."resumeProjectText", T4."projectLevel" as db_project_level
        FROM "Applicant" AS T1
        INNER JOIN "User" AS T2 ON T1."userId" = T2.id
        INNER JOIN "InternshipApplication" AS T3 ON T2.id = T3."applicantId"
        LEFT JOIN "Project" AS T4 ON T1.id = T4."applicantId" 
        WHERE T3."internshipId" = %s
        """,
        (job_id,)
    )
    db_applicants_raw: List[Dict[str, Any]] = cursor.fetchall()
    
    applicant_profiles = []
    
    # Process Applicants and run LLM assessment where needed
    for app_row in db_applicants_raw:
        if not app_row['rawResumeText']: continue

        applicant_id = app_row['id']
        
        # Get all "claimed" skills (from the Skill table)
        cursor.execute('SELECT name FROM "Skill" WHERE "applicantId" = %s', (applicant_id,))
        ocr_skills = [row['name'] for row in cursor.fetchall()]
        
        # Get all "verified" skills
        cursor.execute('SELECT "skillName", "masteryLevel" FROM "VerifiedSkill" WHERE "applicantId" = %s', (applicant_id,))
        verified_skills_data = [VerifiedSkill(**dict(row)) for row in cursor.fetchall()]

        # Determine project level using LLM/DB
        best_project_level = get_applicant_project_level(
            project_text=app_row['resumeProjectText'] or "",
            db_level=app_row['db_project_level'],
            assessor_module=assessor_module,
            llm_context_manager=llm_context_manager
        )
        
        applicant_profiles.append(
            ApplicantProfile(
                id=applicant_id,
                name=app_row['name'],
                rawResumeText=app_row['rawResumeText'],
                ocr_skills=ocr_skills,
                resumeProjectText=app_row['resumeProjectText'] or "",
                verified_skills_data=verified_skills_data,
                best_project_level=best_project_level
            )
        )

    cursor.close()
    conn.close()
    
    unique_profiles = {p.id: p for p in applicant_profiles}
    return job_data, list(unique_profiles.values())

# --- Core Calculation Logic ---
def calculate_shortlist(
    job: JobDetails, 
    applicants: List[ApplicantProfile], 
    sbert_model: SentenceTransformer,
    custom_weights: Optional[Dict[str, float]] = None
) -> List[ApplicantScore]:
    """Calculates the weighted score for each applicant using the provided SBERT model."""
    
    DEFAULT_WEIGHTS = {
        "verified_mastery": 0.30, "experience_match": 0.25, "ocr_skills": 0.10,
        "project_level": 0.15, "bonus_skills": 0.10, "project_relevance": 0.10
    }
    weights = custom_weights if custom_weights else DEFAULT_WEIGHTS
    scored_applicants = []
    
    # Pre-calculate job embeddings and normalized skill sets
    job_resp_embedding = sbert_model.encode(job.description or "", convert_to_tensor=True)
    job_req_skills_norm = {normalize_skill(s) for s in job.required_skills}
    job_pref_skills_norm = {normalize_skill(s) for s in job.preferred_skills}

    project_level_map = {"Beginner": 30, "Intermediate": 60, "Advanced": 90} 

    for applicant in applicants:
        app_skills_norm = {normalize_skill(s) for s in applicant.ocr_skills}

        # SBERT Encoding and Similarity
        resume_embedding = sbert_model.encode(applicant.raw_resume_text or "", convert_to_tensor=True)
        exp_similarity = util.cos_sim(job_resp_embedding, resume_embedding)
        score_experience_match = max(0, exp_similarity.item()) * 100.0
        
        project_embedding = sbert_model.encode(applicant.ocr_projects_text or "", convert_to_tensor=True)
        project_similarity = util.cos_sim(job_resp_embedding, project_embedding)
        score_project_relevance = max(0, project_similarity.item()) * 100.0
        
        # Skill Scoring Logic (remains the same)
        score_ocr_skills = 0.0
        if not job_req_skills_norm: score_ocr_skills = 100.0
        else:
            found_skills = job_req_skills_norm.intersection(app_skills_norm)
            score_ocr_skills = (len(found_skills) / len(job_req_skills_norm)) * 100.0

        score_bonus_skills = 0.0
        if job_pref_skills_norm:
            found_bonus_skills = job_pref_skills_norm.intersection(app_skills_norm)
            score_bonus_skills = (len(found_bonus_skills) / len(job_pref_skills_norm)) * 100.0
            
        score_verified_mastery = 0.0
        if not job_req_skills_norm: score_verified_mastery = 100.0 
        elif applicant.verified_skills_data:
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

        score_project_level = 0.0
        if applicant.best_project_level and applicant.best_project_level in project_level_map:
            score_project_level = project_level_map[applicant.best_project_level]

        # Final Weighted Score Calculation
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
        
    return sorted(scored_applicants, key=lambda x: x.final_score, reverse=True)

# --- Synchronous Orchestration Function ---
def get_shortlist_logic_sync(
    job_id: str, 
    weights: dict,
    sbert_model: SentenceTransformer,
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: Callable[[Any], None]
) -> List[ApplicantScore]:
    """Synchronous function to orchestrate data fetching (DB) and scoring (SBERT/LLM)."""
    
    # 1. Fetch data from DB, including LLM assessment step
    job_data, applicant_profiles = get_job_and_applicants(
        job_id=job_id,
        assessor_module=assessor_module,
        llm_context_manager=llm_context_manager
    )

    if not applicant_profiles:
        return []

    # 2. Run the AI Calculation
    print(f"INFO: Calculating shortlist for job {job_id} with {len(applicant_profiles)} applicants.")
    shortlist = calculate_shortlist(
        job=job_data, 
        applicants=applicant_profiles,
        sbert_model=sbert_model,
        custom_weights=weights
    )
    return shortlist