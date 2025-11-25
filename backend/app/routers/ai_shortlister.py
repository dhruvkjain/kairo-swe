import os
import dspy
import httpx # Library for making async HTTP requests
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Any, Callable, Dict
from contextlib import contextmanager
import asyncio 

# Assuming these imports exist based on the provided context
from app.utils.shortlister_utils import get_shortlist_logic_hybrid, ApplicantScore
from app.models.shortlister_models import ProjectLevelAssessor

# Check for required API Key (only OpenRouter is mandatory)
OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")

if not OPEN_ROUTER_API_KEY:
    raise EnvironmentError("FATAL: Missing environment variable: OPENROUTER_API_KEY")

# Global instances for thread-safe model loading
ASSESSOR_MODULE: Optional[ProjectLevelAssessor] = None
LLM_MODEL_NAME = "openrouter/qwen/qwen3-14b:free" 
LLM_INSTANCE: Optional[dspy.LM] = None

# Using the public (free) inference API endpoint for sentence-transformers/all-mpnet-base-v2
# NOTE: This endpoint is subject to high latency and heavy rate limits, but is cost-free.
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2"
HTTP_CLIENT = httpx.AsyncClient(timeout=60.0) # Shared async HTTP client

def initialize_ai_models():
    """Initializes the DSPy Assessor once."""
    global ASSESSOR_MODULE, LLM_INSTANCE

    # 1. Initialize DSPy/LLM components
    if ASSESSOR_MODULE is None:
        try:
            LLM_INSTANCE = dspy.OpenAI(
                model=LLM_MODEL_NAME, 
                api_key=OPEN_ROUTER_API_KEY, 
                api_base="https://openrouter.ai/api/v1"
            )
            # Initialize the DSPy module class
            ASSESSOR_MODULE = ProjectLevelAssessor()
            print("INFO: DSPy Assessor module initialized.")
            print("INFO: Using FREE, rate-limited public Hugging Face endpoint for embeddings.")

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

# --- Hugging Face API Call Function (Unauthenticated) ---
async def get_embedding(text: str) -> List[float]:
    """
    Fetches sentence embedding for a given text using the Hugging Face public Inference API.
    This is unauthenticated and free, but subject to rate limits and instability.
    """
    if not text:
        # Note: all-mpnet-base-v2 produces a 768-dimension embedding
        return [0.0] * 768 

    # Headers are empty to use the unauthenticated, free public endpoint
    headers = {} 
    
    # HF endpoint takes a JSON body with inputs
    payload = {"inputs": text}
    
    try:
        response = await HTTP_CLIENT.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        response.raise_for_status() # Raise exception for bad status codes (4xx or 5xx)
        
        embedding_data = response.json()
        
        if not embedding_data or not isinstance(embedding_data, list):
             raise ValueError("Hugging Face API returned an unexpected response format.")

        return embedding_data[0] if embedding_data else [0.0] * 768
        
    except httpx.HTTPStatusError as e:
        print(f"ERROR: Hugging Face API HTTP error in FREE mode: {e.response.text}")
        detail_message = (
            f"Hugging Face Free API failed: {e.response.status_code}. "
            "Likely a rate limit error due to concurrent processing. "
            "Please wait or upgrade to a PRO account for stability."
        )
        raise HTTPException(
            status_code=502, 
            detail=detail_message
        )
    except Exception as e:
        print(f"ERROR: General error during Hugging Face call: {e}")
        raise HTTPException(status_code=500, detail="Error fetching embedding from external service.")

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
    and Hugging Face-based semantic scoring using the UNATHENTICATED/FREE API.
    """
    if ASSESSOR_MODULE is None or LLM_INSTANCE is None:
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
    
    # 3. Call the Hybrid Orchestration function directly (it handles the threadpooling internally)
    return await get_shortlist_logic_hybrid( 
        job_id=job_id, 
        weights=weights,
        embedding_function=get_embedding, 
        assessor_module=ASSESSOR_MODULE,
        llm_context_manager=dspy_llm_context(LLM_INSTANCE)
    )