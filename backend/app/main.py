from fastapi import FastAPI
from resume_parser import router as resume_router

app = FastAPI()

app.include_router(
    resume_router, 
    prefix="/api/v1", 
    tags=["Resume Parser"]
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}