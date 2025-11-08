from fastapi import FastAPI, Depends, HTTPException, Query
from typing import List, Dict, Optional
from pydantic import BaseModel
from contextlib import asynccontextmanager

from ai_shortlister import (
    ApplicantScore,
    get_shortlist_logic,
    load_model
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs BEFORE the server starts accepting requests
    load_model() # This runs our synchronous, slow model loading
    print("INFO:     Application startup complete. Server is ready.")
    yield
    # This code runs when the server is shutting down
    print("INFO:     Application shutting down.")

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}

# --- AI SHORTLISTER ENDPOINT ---
@app.get("/api/jobs/{job_id}/shortlist", response_model=List[ApplicantScore])
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
    return get_shortlist_logic(
        job_id=job_id, 
        weights=weights
    )
