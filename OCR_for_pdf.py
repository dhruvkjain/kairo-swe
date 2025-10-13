import PyPDF2
import os

# PDF file name
pdf_file = 'IE415_M2-2.pdf'

# Output text file
txt_file = 'result.txt'

# Open the PDF
pdf = PyPDF2.PdfReader(pdf_file)

# Open (or create) result.txt for writing
with open(txt_file, 'w', encoding='utf-8') as f:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        f.write(f"--- Page {i + 1} ---\n")
        if text:
            f.write(text)
        else:
            f.write("[No text found on this page]\n")
        f.write("\n\n")

print(f"Extraction complete! Text saved in '{os.path.abspath(txt_file)}'")
