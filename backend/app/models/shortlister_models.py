import dspy
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# --- Pydantic Models for Data Structures ---

class VerifiedSkill(BaseModel):
    """Represents a skill and its assessed mastery level."""
    skill: str = Field(..., alias="skillName")
    mastery_level: float = Field(..., alias="masteryLevel")
    
    class Config:
        allow_population_by_field_name = True

class JobDetails(BaseModel):
    """Represents the details of the internship job."""
    id: str
    description: str
    required_skills: List[str] = Field(..., alias="skillsRequired")
    preferred_skills: List[str] = Field(default_factory=list, alias="perks")
    
    class Config:
        allow_population_by_field_name = True

class ApplicantProfile(BaseModel):
    """Represents an applicant's aggregated profile data."""
    id: str
    name: str
    raw_resume_text: str = Field(..., alias="rawResumeText")
    ocr_skills: List[str] = Field(default_factory=list) 
    ocr_projects_text: str = Field(default_factory=str, alias="resumeProjectText")
    verified_skills_data: List[VerifiedSkill] = Field(default_factory=list)
    best_project_level: Optional[str] = None 
    
    # Fields to store the fetched embeddings (Lists of floats)
    resume_embedding: List[float] = Field(default_factory=list)
    project_embedding: List[float] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True

class ApplicantScore(BaseModel):
    """Represents the final score and breakdown for a single applicant."""
    applicant_id: str
    name: str
    final_score: float
    breakdown: Dict[str, float]

# --- DSPy Module for LLM Assessment ---

class ProjectLevelAssessment(dspy.Signature):
    """
    Assesses the complexity and level (Beginner, Intermediate, Advanced) of 
    an applicant's project description based on the provided text.
    """
    project_text = dspy.InputField(desc="The full project description text from the resume.")
    project_level = dspy.OutputField(
        desc="One of: 'Beginner', 'Intermediate', or 'Advanced'. Ensure the response is exactly one of these words."
    )

class ProjectLevelAssessor(dspy.Module):
    """
    A DSPy module that uses the LLM to classify project complexity.
    """
    def __init__(self):
        super().__init__()
        self.predictor = dspy.Predict(ProjectLevelAssessment)

    def forward(self, project_text: str) -> str:
        """Runs the LLM prediction and returns the assessment."""
        if len(project_text) < 20:
            return "Beginner" # Default for minimal text
            
        result = self.predictor(project_text=project_text)
        # Clean and validate the output to ensure it matches expected levels
        level = result.project_level.strip().capitalize()
        if level not in ["Beginner", "Intermediate", "Advanced"]:
            return "Intermediate" # Fallback if LLM gives a strange response
        return level