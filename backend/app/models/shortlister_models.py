import dspy
from pydantic import BaseModel, Field
from typing import Literal

# --- 1. Project Level Assessment Signature ---
class ProjectLevelAssessment(dspy.Signature):
    """
    Assess the complexity and quality of an applicant's project based on its text description, 
    and assign a mastery level. The output must strictly be one of the specified levels.
    """
    project_text: str = dspy.InputField(desc="The text description of the applicant's best project or project summary.")
    
    # The output field uses a Pydantic model for structured, reliable JSON output
    class Output(BaseModel):
        level: Literal["Beginner", "Intermediate", "Advanced"] = Field(
            description="The best fit project level: Beginner, Intermediate, or Advanced."
        )
        reasoning: str = Field(
            description="A concise reason for the assigned project level."
        )
    
    assessment: Output = dspy.OutputField(desc="The structured assessment output.")

# --- 2. Project Level Assessor Module ---
class ProjectLevelAssessor(dspy.Module):
    """
    A dspy module that uses the ProjectLevelAssessment signature to get a structured 
    assessment of a project's level.
    """
    def __init__(self):
        super().__init__()
        # Use dspy.Predict with the structured output signature
        self.predictor = dspy.Predict(ProjectLevelAssessment, output_structure=ProjectLevelAssessment.Output)

    def forward(self, project_text: str) -> str:
        """
        Runs the predictor and returns only the 'level' string.
        
        NOTE: The dspy.context for the LM will be set externally for this function call.
        """
        try:
            prediction = self.predictor(project_text=project_text)
            return prediction.assessment.level
        except Exception as e:
            # Note: This error handling is critical because LLM calls can fail
            print(f"DSPy/LLM Project Level Assessment failed: {e}. Defaulting to Beginner.")
            return "Beginner"