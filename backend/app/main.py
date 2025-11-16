from fastapi import FastAPI, Depends, HTTPException, Query
from contextlib import asynccontextmanager

from resume_parser import router as resume_router
from skill_verifier import router as verifier_router
from ai_shortlister import router as shortlist_router
from ai_shortlister import load_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("INFO:     Server starting up...")
    load_model()
    print("INFO:     Application startup complete. Server is ready.")
    yield
    print("INFO:     Application shutting down.")

app = FastAPI(lifespan=lifespan)

app.include_router(
    shortlist_router, 
    prefix="/api/v1", 
    tags=["AI Shortlister"]
)

app.include_router(
    resume_router, 
    prefix="/api/v1", 
    tags=["Resume Parser"]
)

app.include_router(
    verifier_router, 
    prefix="/api/v1", 
    tags=["Skill Verifier"]  # <-- 2. ADD THIS ROUTER
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}