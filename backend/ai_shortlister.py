"""
AI Shortlister Module (Four-Component Model)

This file contains all the core logic for:
1. Defining data structures (Pydantic models).
2. Loading the AI model.
3. Calculating the multi-component scores:
    - Score 1: Required Skills
    - Score 2: Experience Relevance
    - Score 3: Bonus Skills
    - Score 4: Project Relevance
"""

from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import re

# --- 1. Pydantic Models for Type-Safe Data ---

class JobDetails(BaseModel):
    """Structured data for a single job posting."""
    responsibilities: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)

class ApplicantProfile(BaseModel):
    """
    Structured data for a single applicant.
    This reflects the output of your team's OCR.
    """
    id: int
    name: str
    
    # For semantic match of professional experience
    raw_resume_text: str 
    
    # For keyword match of hard skills
    ocr_skills: List[str] = Field(default_factory=list) 
    
    # For semantic match of project work
    ocr_projects_text: str = Field(default_factory=str) 

class ApplicantScore(BaseModel):
    """The final output for a single scored applicant."""
    applicant_id: int
    name: str
    final_score: float
    breakdown: Dict[str, float] 

# --- 2. AI Model Loading ---

print("INFO:     Loading semantic model (all-mpnet-base-v2)...")
try:
    model = SentenceTransformer('all-mpnet-base-v2')
    print("INFO:     Semantic model loaded successfully.")
except Exception as e:
    print(f"FATAL:    Could not load sentence transformer model: {e}")
    model = None

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
    e.g., "  Python " -> "python"
    e.g., "React.js" -> "react"
    """
    # Simple normalization: lowercase, strip whitespace, remove .js/.py
    skill_lower = skill.lower().strip()
    skill_lower = re.sub(r'[\.\s]', '', skill_lower) # Remove . and whitespace
    return skill_lower


# --- 5. Core Calculation Logic (Updated) ---

def calculate_shortlist(
    job: JobDetails, 
    applicants: List[ApplicantProfile], 
    custom_weights: Optional[Dict[str, float]] = None
) -> List[ApplicantScore]:
    """
    Calculates and ranks applicants for a given job.
    """
    if model is None:
        print("ERROR:    Model not loaded. Cannot calculate shortlist.")
        return []

    weights = custom_weights if custom_weights else DEFAULT_WEIGHTS
    
    scored_applicants = []

    # --- Pre-calculate job data ---
    job_resp_embedding = model.encode(
        job.responsibilities if job.responsibilities else "", 
        convert_to_tensor=True
    )
    
    # Normalize the job skills ONCE, not in a loop
    job_req_skills_norm = {normalize_skill(s) for s in job.required_skills}
    job_pref_skills_norm = {normalize_skill(s) for s in job.preferred_skills}

    for applicant in applicants:
        
        # Normalize the applicant's OCR'd skills
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
        resume_embedding = model.encode(
            applicant.raw_resume_text if applicant.raw_resume_text else "", 
            convert_to_tensor=True
        )
        
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
        # This is the new score!
        score_projects = 0.0
        # Use the job responsibilities as the "target" for project relevance
        project_embedding = model.encode(
            applicant.ocr_projects_text if applicant.ocr_projects_text else "", 
            convert_to_tensor=True
        )
        
        project_similarity = util.cos_sim(job_resp_embedding, project_embedding)
        score_projects = max(0, project_similarity.item()) * 100.0

        # --- Final Weighted Score ---
        final_score = (
            (score_skills * weights["skills"]) +
            (score_experience * weights["experience"]) +
            (score_projects * weights["projects"]) + # NEW
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
                    "project_relevance_score": round(score_projects, 2), # NEW
                    "bonus_skills_score": round(score_bonus, 2)
                }
            )
        )

    sorted_list = sorted(scored_applicants, key=lambda x: x.final_score, reverse=True)
    
    return sorted_list
