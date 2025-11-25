import os
import re
import psycopg2
import numpy as np 
import asyncio
from psycopg2.extras import DictCursor
from typing import List, Dict, Optional, Any, Callable
from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool # REQUIRED for synchronous work
from contextlib import AbstractContextManager

# Import data models and DSPy module from the models file
from app.models.shortlister_models import (
    JobDetails, ApplicantProfile, ApplicantScore, VerifiedSkill, ProjectLevelAssessor
)

# --- Initialization & Globals ---
# NOTE: DATABASE_URL must be set in the environment where the FastAPI app runs
DATABASE_URL = os.getenv("DATABASE_URL")

# --- Helper Functions ---
def normalize_skill(skill: str) -> str:
    """Standardizes a skill name for reliable comparison."""
    skill_lower = skill.lower().strip()
    skill_lower = re.sub(r'[\.\s]', '', skill_lower)
    return skill_lower

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Calculates cosine similarity between two vector lists."""
    if not v1 or not v2:
        return 0.0
    
    # Convert lists to NumPy arrays
    vec1 = np.array(v1)
    vec2 = np.array(v2)
    
    # Calculate dot product
    dot_product = np.dot(vec1, vec2)
    
    # Calculate norms (magnitudes)
    norm_v1 = np.linalg.norm(vec1)
    norm_v2 = np.linalg.norm(vec2)
    
    # Avoid division by zero
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    
    # Cosine Similarity Formula (clamped between 0 and 1)
    similarity = dot_product / (norm_v1 * norm_v2)
    return max(0, similarity)


def get_applicant_project_level(
    project_text: str, 
    db_level: Optional[str],
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: AbstractContextManager[Any]
) -> Optional[str]:
    """
    Determines the best project level. Runs the dspy LLM model on the project text
    if the DB level is missing. This runs synchronously within a threadpool.
    """
    if db_level:
        return db_level
    
    if not project_text or len(project_text) < 20:
        return "Beginner"

    # Use the provided context manager to configure the LLM for the DSPy call
    try:
        with llm_context_manager:
            return assessor_module.forward(project_text=project_text)
    except Exception as e:
        # Fallback in case of LLM failure
        print(f"LLM Assessment failed: {e}. Defaulting to Beginner.")
        return "Beginner"


def get_job_and_applicants_data(
    job_id: str,
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: AbstractContextManager[Any]
) -> tuple[JobDetails, List[ApplicantProfile]]:
    """
    Fetches job and applicant data from the database, and performs the LLM
    project assessment step. This is a synchronous operation run in a threadpool.
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
        INNER JOIN "InternshipApplication" AS T3 ON T1.id = T3."applicantId"
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
        
        # Get all "verified" skills
        cursor.execute('SELECT "skillName", "masteryLevel" FROM "VerifiedSkill" WHERE "applicantId" = %s', (applicant_id,))
        verified_skills_data = [VerifiedSkill(**dict(row)) for row in cursor.fetchall()]

        # Determine project level using LLM/DB (Synchronous DSPy call)
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
                ocr_skills=[], # Assuming this needs to be fetched separately if needed
                resumeProjectText=app_row['resumeProjectText'] or "",
                verified_skills_data=verified_skills_data,
                best_project_level=best_project_level,
                # Embeddings are empty lists for now, to be filled by the async router
                resume_embedding=[],
                project_embedding=[]
            )
        )

    cursor.close()
    conn.close()
    
    unique_profiles = {p.id: p for p in applicant_profiles}
    return job_data, list(unique_profiles.values())

# --- Core Calculation Logic (Synchronous) ---
def calculate_shortlist(
    job: JobDetails, 
    applicants: List[ApplicantProfile], 
    job_embedding: List[float],
    custom_weights: Optional[Dict[str, float]] = None
) -> List[ApplicantScore]:
    """
    Calculates the weighted score for each applicant using pre-calculated embeddings.
    This function is purely synchronous and mathematical (suitable for threadpool).
    """
    
    DEFAULT_WEIGHTS = {
        "verified_mastery": 0.35, "experience_match": 0.25, "ocr_skills": 0.15,
        "project_level": 0.10, "bonus_skills": 0.10, "project_relevance": 0.05
    }
    weights = custom_weights if custom_weights else DEFAULT_WEIGHTS
    scored_applicants = []
    
    # Pre-calculate normalized skill sets
    job_req_skills_norm = {normalize_skill(s) for s in job.required_skills}
    job_pref_skills_norm = {normalize_skill(s) for s in job.preferred_skills}

    project_level_map = {"Beginner": 30, "Intermediate": 60, "Advanced": 90} 

    for applicant in applicants:
        app_skills_norm = {normalize_skill(s) for s in applicant.ocr_skills}

        # 1. Semantic Scoring (uses pre-calculated embeddings)
        exp_similarity = cosine_similarity(job_embedding, applicant.resume_embedding)
        score_experience_match = exp_similarity * 100.0
        
        project_similarity = cosine_similarity(job_embedding, applicant.project_embedding)
        score_project_relevance = project_similarity * 100.0
        
        # 2. Skill Matching (OCR/Claimed skills)
        score_ocr_skills = 0.0
        if not job_req_skills_norm: score_ocr_skills = 100.0
        else:
            found_skills = job_req_skills_norm.intersection(app_skills_norm)
            score_ocr_skills = (len(found_skills) / len(job_req_skills_norm)) * 100.0

        score_bonus_skills = 0.0
        if job_pref_skills_norm:
            found_bonus_skills = job_pref_skills_norm.intersection(app_skills_norm)
            score_bonus_skills = (len(found_bonus_skills) / len(job_pref_skills_norm)) * 100.0
            
        # 3. Verified Skill Mastery
        score_verified_mastery = 0.0
        if not job_req_skills_norm: score_verified_mastery = 100.0 
        elif applicant.verified_skills_data:
            app_verified_map = {
                normalize_skill(v.skill): v.mastery_level
                for v in applicant.verified_skills_data
            }
            total_mastery_score = 0.0
            MAX_SKILL_MASTERY = 10.0 # Assuming mastery level is out of 10
            for req_skill in job_req_skills_norm:
                mastery = app_verified_map.get(req_skill, 0.0)
                total_mastery_score += mastery
            
            max_possible_score = len(job_req_skills_norm) * MAX_SKILL_MASTERY
            if max_possible_score > 0:
                score_verified_mastery = (total_mastery_score / max_possible_score) * 100.0
            else: score_verified_mastery = 100.0

        # 4. Project Level Assessment
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


# --- Synchronous Orchestration Function (Inner Call) ---
def get_job_and_applicants_for_scoring(
    job_id: str,
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: AbstractContextManager[Any]
) -> tuple[JobDetails, List[ApplicantProfile]]:
    """
    Synchronous function to orchestrate data fetching (DB) and LLM assessment (DSPy).
    This runs inside the threadpool.
    """
    
    # 1. Fetch data from DB, including LLM assessment step
    job_data, applicant_profiles = get_job_and_applicants_data(
        job_id=job_id,
        assessor_module=assessor_module,
        llm_context_manager=llm_context_manager
    )
    return job_data, applicant_profiles


# --- Hybrid Orchestration Function (API Call Target) ---
async def get_shortlist_logic_hybrid(
    job_id: str, 
    weights: dict,
    assessor_module: ProjectLevelAssessor,
    llm_context_manager: AbstractContextManager[Any],
    embedding_function: Callable[[str], List[float]] # Async callback from router
) -> List[ApplicantScore]:
    """
    Hybrid function to orchestrate data fetching (sync), embedding (async), and scoring (sync).
    """
    
    # 1. Synchronous Work (DB Fetch + LLM Project Assessment) in a threadpool
    print("INFO: Starting synchronous DB fetch and LLM assessment...")
    job_data, applicant_profiles = await run_in_threadpool(
        get_job_and_applicants_for_scoring, 
        job_id=job_id,
        assessor_module=assessor_module,
        llm_context_manager=llm_context_manager
    )

    if not applicant_profiles:
        return []
        
    # 2. Asynchronous Work (Hugging Face Embedding Calls)
    print(f"INFO: Concurrently fetching {len(applicant_profiles)*2 + 1} embeddings from Hugging Face API...")
    
    # Collect all texts that need embedding
    texts_to_embed = [job_data.description]
    for app in applicant_profiles:
        texts_to_embed.append(app.raw_resume_text)
        texts_to_embed.append(app.ocr_projects_text)

    # Concurrently fetch all embeddings using the provided async callback
    embeddings = await asyncio.gather(*(embedding_function(text) for text in texts_to_embed))
    
    # Distribute embeddings back into the data structures
    job_embedding = embeddings.pop(0)
    for app in applicant_profiles:
        app.resume_embedding = embeddings.pop(0)
        app.project_embedding = embeddings.pop(0)

    # 3. Synchronous Work (Final Calculation) in a threadpool
    print("INFO: Calculating final shortlist scores...")
    
    # Calculate the final scores using the synchronous math logic
    return await run_in_threadpool(
        calculate_shortlist, 
        job=job_data, 
        applicants=applicant_profiles,
        job_embedding=job_embedding,
        custom_weights=weights
    )