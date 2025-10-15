import base64
from pathlib import Path
from google.genai import Client
from google.genai.types import Part
import fitz  # PyMuPDF

# Initialize Gemini client
client = Client(api_key="YOUR_GEMINI_API_KEY")

def extract_text_from_image(image_path):
    """Extract text from an image using Gemini API"""
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    image_part = Part(
        inline_data={"mime_type": "image/png", "data": image_base64}
    )

    prompt = "Extract all text from the provided image."

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[image_part, {"text": prompt}],
    )

    return response.text

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using PyMuPDF"""
    doc = fitz.open(pdf_path)
    full_text = ""
    for i, page in enumerate(doc, 1):
        page_text = page.get_text()
        full_text += f"\n\n--- Page {i} ---\n{page_text}"
    return full_text

def main():
    # Ask user for input file
    input_file = input("Enter path to PDF or Image file: ").strip()
    output_file = "extracted_text.txt"

    ext = Path(input_file).suffix.lower()
    if ext in [".png", ".jpg", ".jpeg"]:
        extracted_text = extract_text_from_image(input_file)
    elif ext == ".pdf":
        extracted_text = extract_text_from_pdf(input_file)
    else:
        raise ValueError("Unsupported file type. Use PDF or PNG/JPG image.")

    # Save extracted text
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    print(f"\n✅ Extracted text saved to {output_file}")

if __name__ == "__main__":
    main()
