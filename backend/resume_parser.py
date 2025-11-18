import os
import json
import tempfile
import requests
import pdfplumber
import docx
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool

load_dotenv(encoding='utf-8-sig')
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)

STRING_OR_NULL = "string or null"
router = APIRouter()

# --- Pydantic Model ---
class ResumeUrlRequest(BaseModel):
    url: str

# --- HELPERS ---

def extract_text_from_file(file_path: str, file_type: str) -> str:
    """Extract raw text from PDF or DOCX."""
    text = ""
    try:
        if file_type == 'pdf':
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

        elif file_type == 'docx':
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"

    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

    return text


def get_gemini_prompt(resume_text: str) -> str:
    json_schema = {
        "name": STRING_OR_NULL,
        "gender": STRING_OR_NULL,
        "source": STRING_OR_NULL,
        "appliedFor": STRING_OR_NULL,
        "appliedDate": STRING_OR_NULL,
        "status": STRING_OR_NULL,

        "email": STRING_OR_NULL,
        "phone": STRING_OR_NULL,

        "college": STRING_OR_NULL,
        "course": STRING_OR_NULL,
        "year": STRING_OR_NULL,
        "cgpa": STRING_OR_NULL,

        "skills": ["list", "of", "strings"],
        "experience": STRING_OR_NULL,

        "resumeUrl": STRING_OR_NULL
    }

    return f"""
You are an expert resume parsing API. 
Analyze the following resume text and extract the information into a single, valid JSON object.

Adhere strictly to this JSON schema: {json.dumps(json_schema)}

Rules:
- If a field is missing, return null (for strings) or [] (for lists).
- Do NOT include explanations or markdown formatting like ```json.
- Extract phone numbers, email, education, skills, gender (if deducible), and experience.
- appliedFor = The job role mentioned in the resume.
- appliedDate = null unless a date is actually found.
- source = "Company Website" unless otherwise stated.
- resumeUrl = Leave as null (backend will fill it).

Resume Text:
---
{resume_text}
---
"""


def _parse_resume_blocking_tasks(url: str) -> str:
    """
    All blocking I/O and CPU parsing happens here.
    Runs inside threadpool.
    """
    temp_file_path = None
    try:
        response = requests.get(url)
        response.raise_for_status()

        if ".pdf" in url.lower():
            file_suffix, file_type = ".pdf", "pdf"
        elif ".docx" in url.lower():
            file_suffix, file_type = ".docx", "docx"
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Upload only .pdf or .docx")

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_suffix) as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        raw_text = extract_text_from_file(temp_file_path, file_type)
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the resume.")

        return raw_text

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"File processing error: {str(e)}")

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


# --- MAIN PARSER ---
async def parse_resume_from_url(url: str) -> dict:
    try:
        raw_text = await run_in_threadpool(_parse_resume_blocking_tasks, url=url)

        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = get_gemini_prompt(raw_text)

        gemini_response = await model.generate_content_async(prompt)

        response_text = (
            gemini_response.text
            .strip()
            .replace("```json", "")
            .replace("```", "")
        )

        parsed_json = json.loads(response_text)
        return parsed_json

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Gemini returned invalid JSON")

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


# --- API ENDPOINT ---
@router.post("/parse-resume")
async def handle_resume_parsing(request: ResumeUrlRequest):
    data = await parse_resume_from_url(request.url)
    
    # Add resume URL
    data["resumeUrl"] = request.url
    
    # Default values if Gemini misses fields
    defaults = {
        "source": "Company Website",
        "status": "Applied",
        "appliedDate": None
    }

    for key, value in defaults.items():
        if key not in data or data[key] is None:
            data[key] = value

    return data
