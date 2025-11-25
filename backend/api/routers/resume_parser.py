import json
import dspy
from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
import re # Import the regular expression module

from api.config.config import OPEN_ROUTER_API_KEY
from api.models.resume_parser_models import ResumeUrlRequest
from api.utils.pdf_utils import load_and_extract

if not OPEN_ROUTER_API_KEY:
    raise EnvironmentError("OPEN_ROUTER_API_KEY not found")

router = APIRouter()

# ----------------------------------------------------------
# DSPy Signature for AI Module
# ----------------------------------------------------------
class ResumeParser(dspy.Module):
    def __init__(self):
        super().__init__()
        self.predict = dspy.Predict("prompt -> output_json")

    def forward(self, raw_text: str):
        schema = {
            "name": "string or null",
            "gender": "string or null",
            "source": "string or null",
            "appliedFor": "string or null",
            "appliedDate": "string or null",
            "status": "string or null",
            "email": "string or null",
            "phone": "string or null",
            "college": "string or null",
            "course": "string or null",
            "year": "string or null",
            "cgpa": "string or null",
            "skills": ["list", "of", "strings"],
            "experience": "string or null",
            "resumeUrl": "string or null"
        }

        # IMPORTANT: Reinforce the single-output instruction in the prompt
        prompt = f"""
        You are an expert resume parsing API. 
        Analyze the following resume text and extract the information into a single, raw JSON object. 
        
        Adhere strictly to this JSON schema: {json.dumps(schema)} 
        
        Rules: 
        - Your output MUST be ONLY the raw JSON object, starting with '{{' and ending with '}}'.
        - Do NOT include markdown code blocks, preambles, or explanations.
        - If a field is missing, return null (for strings) or [] (for lists). 
        - Extract phone numbers, email, education, skills, gender (if deducible), and experience.
        - appliedFor = The job role mentioned in the resume.
        - appliedDate = null unless a date is actually found.
        - source = "Company Website" unless otherwise stated.
        - resumeUrl = Leave as null (backend will fill it).
        
        Resume Text:
        {raw_text}
        """

        out = self.predict(prompt=prompt)
        return out.output_json


ai_model = ResumeParser()

# ----------------------------------------------------------
# Endpoint
# ----------------------------------------------------------

@router.post("/parse-resume")
async def parse_resume(req: ResumeUrlRequest):
    # ---------------------------
    # 1. Extract raw text + links
    # ---------------------------
    result = await run_in_threadpool(load_and_extract, req.url)

    raw_text = result["raw_text"]
    links = result["links"]

    # configuration of DSPy + OpenRouter
    qwen_lm=dspy.LM(
        api_key=OPEN_ROUTER_API_KEY,
        model="openrouter/qwen/qwen3-14b:free",
        api_base="https://openrouter.ai/api/v1"
    )
    dspy.configure(lm=qwen_lm)

    # ---------------------------
    # 2. AI parses based on raw text
    # ---------------------------
    try:
        with dspy.context(lm=qwen_lm):
            # Step 1: Get the raw, potentially messy output from the LLM
            llm_raw_output = ai_model(raw_text=raw_text)
            
            # Step 2: Use regex to find and extract the valid JSON object
            # This looks for the content between the first '{' and the last '}'
            # This is the most robust way to handle LLM preamble/postamble text.
            match = re.search(r'\{.*\}', llm_raw_output, re.DOTALL)
            
            if match:
                json_str = match.group(0)
            else:
                # If regex fails, assume the whole string is the JSON (less safe)
                json_str = llm_raw_output.strip()

            # Step 3: Attempt to load the cleaned string
            data = json.loads(json_str)

    except json.JSONDecodeError as e:
        # Catch specific JSON error and log the raw output for better debugging
        print(f"JSON DECODE ERROR: {e}. Raw LLM output was: \n{llm_raw_output}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI Error: Failed to parse valid JSON from LLM. (Error: {e})"
        )
    except Exception as e:
        print("OTHER ERROR:", type(e).__name__, str(e))
        raise HTTPException(500, f"AI Error: {e}")

    # ---------------------------
    # 3. Add additional fields
    # ---------------------------
    # Set default values and inject backend-controlled fields
    data["resumeUrl"] = req.url
    data["links"] = links
    data["rawResumeText"] = raw_text
    data.setdefault("source", "Company Website")
    data.setdefault("status", "Applied")
    data.setdefault("appliedDate", None)

    return data