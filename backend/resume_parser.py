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

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)

STRING_OR_NULL = "string or null"

router = APIRouter()

class ResumeUrlRequest(BaseModel):
    """Defines the request body, expects a 'url' field."""
    url: str


def extract_text_from_file(file_path: str, file_type: str) -> str:
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
    """Generates a prompt for the Gemini model based on the resume text."""
    json_schema = {
        "name": STRING_OR_NULL,
        "contact_info": {
            "email": STRING_OR_NULL,
            "phone_primary": STRING_OR_NULL,
            "phone_secondary": STRING_OR_NULL
        },
        "skills": ["list", "of", "skill", "strings"],
        "projects": [
            {
                "title": "string",
                "description": "string",
                "skills_used": ["list", "of", "strings"]
            }
        ],
        "experience": [
            {
                "job_title": STRING_OR_NULL,
                "company": STRING_OR_NULL,
                "description": STRING_OR_NULL
            }
        ]
    }
    
    return f"""
    You are an expert resume parsing API. 
    Analyze the following resume text and extract the information into a single, valid JSON object.
    Adhere strictly to this JSON schema: {json.dumps(json_schema)}
    
    Rules:
    - If a field is not found, return null (for strings) or an empty list [] (for lists).
    - Do not include any text, explanations, or markdown formatting (like ```json) outside of the JSON object itself.
    - For 'phone_primary', try to find the 'Primary' number. If not specified, use the first one found.
    - For 'phone_secondary', use the 'Secondary' number if available.

    Resume Text:
    ---
    {resume_text}
    ---
    """

async def parse_resume_from_url(url: str) -> dict:
    temp_file_path = None
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        if ".pdf" in url.lower():
            file_suffix, file_type = ".pdf", "pdf"
        elif ".docx" in url.lower():
            file_suffix, file_type = ".docx", "docx"
        else:
            raise HTTPException(status_code=400, detail="File type not supported. Please upload a .pdf or .docx file.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_suffix) as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # 1. Extract Text
        raw_text = extract_text_from_file(temp_file_path, file_type)
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the file.")

        # 2. Generate Prompt and call Gemini
        model = genai.GenerativeModel('gemini-pro')
        prompt = get_gemini_prompt(raw_text)
        
        # Use the async version for FastAPI
        gemini_response = await model.generate_content_async(prompt)
        
        # 3. Clean and parse the response
        response_text = gemini_response.text.strip().replace("```json\n", "").replace("\n```", "")
        
        parsed_json = json.loads(response_text)
        return parsed_json

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions directly
        raise http_exc
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        # 4. Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)

# --- API Endpoint Definition ---

@router.post("/parse-resume")
async def handle_resume_parsing(request: ResumeUrlRequest):
    data = await parse_resume_from_url(request.url)
    return data