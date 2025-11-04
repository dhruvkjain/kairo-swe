from fastapi import FastAPI
from fastapi import HTTPException, Query
from typing import List, Dict, Optional

# This imports the code from the file you just created
from ai_shortlister import (
    calculate_shortlist,
    JobDetails,
    ApplicantProfile,
    ApplicantScore
)

FAKE_DB_JOBS = {
    1: {
        "id": 1,
        "title": "Backend Python Developer",
        "responsibilities": "Build and maintain scalable FastAPI applications. Work with databases and cloud services. Write clean, testable code. We value leadership and teamwork.",
        "required_skills": ["Python", "FastAPI", "SQL"],
        "preferred_skills": ["Redis", "Docker", "AWS"]
    },
    2: {
        "id": 2,
        "title": "Senior React Developer",
        "responsibilities": "Develop responsive and complex user interfaces using Next.js and React. Must have experience with state management and testing. Build reusable components.",
        "required_skills": ["JavaScript", "React", "Next.js", "State Management"],
        "preferred_skills": ["TypeScript", "Testing"]
    }
}

FAKE_DB_APPLICANTS = [
    {
        "id": 101,
        "name": "Alice Smith (Perfect Python Match)",
        "raw_resume_text": "I am a senior Python developer with 5 years of experience in FastAPI and SQL databases. I also have experience with Docker and AWS.",
        "ocr_skills": ["Python", "FastAPI", "SQL", "Docker", "AWS", "PostgreSQL"],
        "ocr_projects_text": "Project A: Built a high-traffic e-commerce backend using FastAPI and Redis. Project B: Deployed a containerized app with Docker.",
        "applied_jobs": [1]
    },
    {
        "id": 102,
        "name": "Bob Johnson (Good Experience, Missing Skills)",
        "raw_resume_text": "Experienced software engineer. I led a team that built microservices in Python. I am a quick learner and very interested in backend systems.",
        "ocr_skills": ["Python", "Leadership", "Microservices", "Teamwork"],
        "ocr_projects_text": "Project: Internal management tool for my team at Google. Used Python and Flask.",
        "applied_jobs": [1]
    },
    {
        "id": 103,
        "name": "Charlie Brown (Frontend Dev)",
        "raw_resume_text": "I love building user interfaces with React and Next.js. My main focus is JavaScript and frontend technologies. My projects showcase my skills.",
        "ocr_skills": ["React", "Next.js", "JavaScript", "CSS"],
        "ocr_projects_text": "Project: My portfolio website. Built with Next.js and Tailwind. Project 2: A small to-do list app with React.",
        "applied_jobs": [1, 2]
    },
    {
        "id": 104,
        "name": "David Lee (Perfect Frontend Match)",
        "raw_resume_text": "Skilled frontend engineer specializing in React, Next.js, and TypeScript. Building beautiful and fast user experiences is my passion. Experienced with Redux and testing libraries.",
        "ocr_skills": ["React", "Next.js", "JavaScript", "TypeScript", "Redux", "Testing"],
        "ocr_projects_text": "Project 1: Enterprise-level dashboard for a client, using React, TypeScript, and Redux (State Management). Project 2: My personal blog, built with Next.js.",
        "applied_jobs": [2]
    }
]


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/jobs/{job_id}/shortlist", response_model=List[ApplicantScore])
async def get_ai_shortlist(
    job_id: int,
    # Define the weights as optional query parameters
    weight_skills: float = Query(0.4, ge=0, le=1),
    weight_experience: float = Query(0.3, ge=0, le=1),
    weight_projects: float = Query(0.2, ge=0, le=1), # NEW
    weight_bonus: float = Query(0.1, ge=0, le=1)
):
    """
    Generates an AI-powered, ranked shortlist of applicants for a given job.
    Recruiters can optionally provide weights for scoring.
    """
    
    # --- 1. Validation: Ensure weights sum to 1.0 ---
    total_weight = weight_skills + weight_experience + weight_projects + weight_bonus
    # Use a small epsilon for float comparison
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(
            status_code=400, 
            detail=f"Weights must sum to 1.0, but received: {total_weight}"
        )
    
    weights = {
        "skills": weight_skills,
        "experience": weight_experience,
        "projects": weight_projects, # NEW
        "bonus": weight_bonus
    }

    # --- 2. Get Job Data from DB ---
    # !!! REPLACE THIS with your real Supabase/Prisma query !!!
    db_job = FAKE_DB_JOBS.get(job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Validate and structure the job data
    try:
        job_data = JobDetails(**db_job)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job data is malformed: {e}")

    # --- 3. Get Applicant Data from DB ---
    # !!! REPLACE THIS with your real Supabase/Prisma query !!!
    db_applicants = [
        app for app in FAKE_DB_APPLICANTS if job_id in app["applied_jobs"]
    ]
    
    applicant_profiles = []
    for app in db_applicants:
        # Robustness: Only include applicants who HAVE raw text
        if app.get("raw_resume_text"):
            applicant_profiles.append(
                ApplicantProfile(
                    id=app["id"],
                    name=app["name"],
    
                    # --- THIS IS THE UPDATED PART ---
                    raw_resume_text=app["raw_resume_text"],
                    ocr_skills=app.get("ocr_skills", []), 
                    ocr_projects_text=app.get("ocr_projects_text", "") # NEW
                    # --- END OF UPDATE ---
                )
            )

    # Edge Case: No applicants for this job
    if not applicant_profiles:
        return [] # Return an empty list

    # --- 4. Run the AI Calculation ---
    print(f"INFO:     Calculating shortlist for job {job_id} with weights: {weights}")
    shortlist = calculate_shortlist(
        job=job_data, 
        applicants=applicant_profiles,
        custom_weights=weights
    )
    
    return shortlist
