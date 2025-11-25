import os
import re
import tempfile
import requests
import pdfplumber
import docx
from fastapi import HTTPException


# -------------------------------------------------
# Google Drive URL Auto-Resolution
# -------------------------------------------------
def resolve_gdrive_url(url: str) -> str:
    url = url.strip()

    if "drive.google.com" not in url:
        return url  # not a Google Drive link → leave unchanged

    # Pattern for: /file/d/<ID>/ or ?id=<ID>
    match = (
        re.search(r"/d/([a-zA-Z0-9_-]+)", url)
        or re.search(r"id=([a-zA-Z0-9_-]+)", url)
    )

    if not match:
        raise HTTPException(
            400,
            "Invalid Google Drive link. Unable to extract file ID."
        )

    file_id = match.group(1)
    return f"https://drive.google.com/uc?export=download&id={file_id}"


# -------------------------------------------------
# Download file (PDF / DOCX)
# -------------------------------------------------
def download_file(url: str) -> bytes:
    try:
        # auto-fix Google Drive links
        url = resolve_gdrive_url(url)

        r = requests.get(url, allow_redirects=True)
        r.raise_for_status()
        return r.content

    except Exception:
        raise HTTPException(400, "Unable to download file")


# -------------------------------------------------
# File Type Detection
# -------------------------------------------------
def detect_file_type(url: str) -> str:
    url = url.lower()
    if url.endswith(".pdf"):
        return "pdf"
    if url.endswith(".docx"):
        return "docx"

    # Google Drive links don't have extensions → treat as PDF
    if "drive.google.com" in url:
        return "pdf"

    raise HTTPException(400, "Unsupported file type. Only PDF or DOCX allowed.")


# -------------------------------------------------
# Extract Raw Text
# -------------------------------------------------
def extract_text(file_path: str, file_type: str) -> str:
    text = ""
    try:
        if file_type == "pdf":
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += (page.extract_text() or "") + "\n"

        elif file_type == "docx":
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"

    except Exception:
        return ""

    return text


# -------------------------------------------------
# Extract PDF Hyperlinks
# -------------------------------------------------
def extract_pdf_links(file_path: str):
    links = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                if not page.annots:
                    continue
                for annot in page.annots:
                    uri = annot.get("uri")
                    if uri:
                        links.append(uri)
    except Exception:
        pass
    return links


# -------------------------------------------------
# Main Utility — unified return
# -------------------------------------------------
def load_and_extract(url: str) -> dict:
    url = resolve_gdrive_url(url)
    file_type = detect_file_type(url)
    temp_path = None

    try:
        content = download_file(url)

        suffix = f".{file_type}"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(content)
            temp_path = tmp.name

        raw_text = extract_text(temp_path, file_type)
        if not raw_text.strip():
            raise HTTPException(400, "Failed to extract text from file.")

        links = extract_pdf_links(temp_path) if file_type == "pdf" else []

        return {
            "raw_text": raw_text,
            "links": links,
            "file_type": file_type,
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
