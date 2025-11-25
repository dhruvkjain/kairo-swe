from pydantic import BaseModel, Field

class SkillMastery(BaseModel):
    skill: str
    mastery_level: float = Field(..., ge=0.0, le=10.0)
    evidence: str


class VerificationResponse(BaseModel):
    project_level: str
    verified_skills: list[SkillMastery]
    analysis: str
    code_quality_score: float


class RepoUrlRequest(BaseModel):
    url: str
