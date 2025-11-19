import os
import dspy
from fastapi import APIRouter, HTTPException, Query
from fastapi.concurrency import run_in_threadpool
from sentence_transformers import SentenceTransformer
from typing import List, Optional, Any, Callable
from contextlib import contextmanager

# Assume these imports exist based on the provided context
from app.config.config import OPEN_ROUTER_API_KEY # Mocked/Assumed
# from app.models.shortlister_models import ApplicantScore # Assuming ApplicantScore is in utils
from app.utils.utils import get_shortlist_logic_sync, ApplicantScore
from app.dspy_models import ProjectLevelAssessor

# --- Module-Level Initialization ---

# Check for required API Key
if not OPEN_ROUTER_API_KEY:
    raise EnvironmentError("OPEN_ROUTER_API_KEY not found")

# Global instances for thread-safe model loading
SBERT_MODEL: Optional[SentenceTransformer] = None
ASSESSOR_MODULE: Optional[ProjectLevelAssessor] = None
LLM_MODEL_NAME = "openrouter/qwen/qwen3-14b:free" 
LLM_INSTANCE: Optional[dspy.LM] = None

def initialize_ai_models():
    """Initializes heavy AI models (SBERT) and the DSPy Assessor once."""
    global SBERT_MODEL, ASSESSOR_MODULE, LLM_INSTANCE

    # 1. Load Sentence Transformer (SBERT)
    if SBERT_MODEL is None:
        print("INFO: Loading SBERT model (all-mpnet-base-v2)...")
        try:
            # SBERT model is only loaded once
            SBERT_MODEL = SentenceTransformer('all-mpnet-base-v2')
            print("INFO: SBERT model loaded.")
        except Exception as e:
            # This is a critical failure for the shortlister service
            raise RuntimeError(f"FATAL: Could not load sentence transformer model: {e}")

    # 2. Initialize DSPy/LLM components
    if ASSESSOR_MODULE is None:
        try:
            # LLM setup, the LM instance is configured but not globally set 
            # with dspy.configure yet, as we need to use it in a thread-safe way.
            LLM_INSTANCE = dspy.OpenAI(
                model=LLM_MODEL_NAME, 
                api_key=OPEN_ROUTER_API_KEY, 
                api_base="https://openrouter.ai/api/v1"
            )
            # Initialize the DSPy module class
            ASSESSOR_MODULE = ProjectLevelAssessor()
            print("INFO: DSPy Assessor module initialized.")
        except Exception as e:
            print(f"FATAL: Could not configure DSPy/OpenRouter or initialize Assessor: {e}")
            ASSESSOR_MODULE = None

# Call initialization when the module is imported
try:
    initialize_ai_models()
except Exception as e:
    print(f"ERROR during AI model initialization: {e}")


@contextmanager
def dspy_llm_context(lm: dspy.LM):
    """A context manager to safely configure and unconfigure the DSPy LM globally 
    for the duration of a synchronous function call."""
    old_lm = dspy.settings.lm
    dspy.configure(lm=lm)
    try:
        yield
    finally:
        dspy.configure(lm=old_lm)

# ----------------------------------------------------------
# Router Definition
# ----------------------------------------------------------
router = APIRouter()

@router.get("/internships/{job_id}/shortlist", response_model=List[ApplicantScore])
async def get_ai_shortlist(
    job_id: str,
    # Weights as Query Parameters with default values summing to 1.0
    weight_verified_mastery: float = Query(0.35, ge=0, le=1, description="Weight for verified skills mastery."),
    weight_experience_match: float = Query(0.25, ge=0, le=1, description="Weight for semantic resume match."),
    weight_ocr_skills: float = Query(0.15, ge=0, le=1, description="Weight for claimed skills match (OCR)."),
    weight_project_level: float = Query(0.10, ge=0, le=1, description="Weight for project difficulty level (LLM-assessed)."),
    weight_bonus_skills: float = Query(0.10, ge=0, le=1, description="Weight for preferred skills match."),
    weight_project_relevance: float = Query(0.05, ge=0, le=1, description="Weight for semantic project relevance.")
): 
    """
    Generates a weighted shortlist of applicants for a given internship job ID.
    
    This endpoint orchestrates database lookups, LLM project assessment, 
    and SBERT-based semantic scoring.
    """
    if SBERT_MODEL is None or ASSESSOR_MODULE is None or LLM_INSTANCE is None:
        raise HTTPException(
            status_code=503, 
            detail="AI models are not initialized. Check server logs."
        )

    # 1. Validation: Ensure weights sum to 1.0
    weights_list = [
        weight_verified_mastery, weight_experience_match, weight_ocr_skills,
        weight_project_level, weight_bonus_skills, weight_project_relevance
    ]
    total_weight = sum(weights_list)
    
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(
            status_code=400, 
            detail=f"Weights must sum to 1.0 (or very close), but received: {total_weight}"
        )
    
    # 2. Create Weights Dictionary
    weights = {
        "verified_mastery": weight_verified_mastery, "experience_match": weight_experience_match,
        "ocr_skills": weight_ocr_skills, "project_level": weight_project_level,
        "bonus_skills": weight_bonus_skills, "project_relevance": weight_project_relevance
    }

    # 3. Call the Logic Function in a threadpool
    # We pass all dependencies to the sync function, including the LLM context manager
    return await run_in_threadpool(
        get_shortlist_logic_sync, 
        job_id=job_id, 
        weights=weights,
        sbert_model=SBERT_MODEL,
        assessor_module=ASSESSOR_MODULE,
        llm_context_manager=dspy_llm_context(LLM_INSTANCE)
    )