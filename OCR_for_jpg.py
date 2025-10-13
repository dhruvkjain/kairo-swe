from PIL import Image
import pytesseract
import os

# PNG file
image_file = 'image.png'

# Output text file
txt_file = 'result.txt'

# Set the path to Tesseract executable manually
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Change if your path is different

# Open image and extract text
text = pytesseract.image_to_string(Image.open(image_file))

# Save text to result.txt
with open(txt_file, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Text extraction complete! Saved in '{os.path.abspath(txt_file)}'")
