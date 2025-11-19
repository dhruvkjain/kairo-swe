from pydantic import BaseModel

class ResumeUrlRequest(BaseModel):
    url: str