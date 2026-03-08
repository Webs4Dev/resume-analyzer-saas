import pdfplumber
import re
from pdf2image import convert_from_path
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_pdf(file_path):

    images = convert_from_path(
    file_path,
    poppler_path=r"poppler-25.12.0\Library\bin"
)
    text = ""

    for img in images:
        text += pytesseract.image_to_string(img)

    return text

def read_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    if text.strip() == "":
        print("⚠️ Using OCR for scanned resume...")
        text = ocr_pdf(file_path)

    return text

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\|', ' ', text)
    text = re.sub(r'[•–]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'i\.|ii\.|iii\.', '', text)
    return text.strip()

def remove_unwanted(text):
    text = re.sub(r'\+91\d{10}', ' <PHONE> ', text)
    text = re.sub(r'\S+@\S+', ' <EMAIL> ', text)
    return text

def add_section_breaks(text):
    headers = [
        "education",
        "additional courses",
        "projects",
        "technical skills",
        "soft skills"
    ]
    for h in headers:
        text = text.replace(h, f"\n{h}\n")
    return text

section_alias_map = {
    "education": ["education", "academic background"],
    "projects": ["projects", "project work", "academic projects"],
    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "internships",
        "internship experience"
    ],
    "technical_skills": [
        "technical skills",
        "skills",
        "technical expertise",
        "tools"
    ],
    "soft_skills": [
        "soft skills",
        "personal skills",
        "interpersonal skills"
    ],
    "certifications": [
        "certifications",
        "additional courses",
        "courses",
        "training"
    ]
}

def detect_section(line):
    for key, values in section_alias_map.items():
        if line.lower() in values:
            return key
    return None

def sections(text):

    sections = {
        "personal_info": [],
        "education": [],
        "experience": [],
        "projects": [],
        "technical_skills": [],
        "soft_skills": [],
        "certifications": []
    }

    current = "personal_info"

    for line in text.split("\n"):
        line = line.strip().lower()

        if not line:
            continue

        detected = detect_section(line)

        if detected:
            current = detected
        else:
            sections[current].append(line)

    return sections

def get_text(resume_info,job_description):
    resume_text = clean_text(resume_info)
    cleaned_text = remove_unwanted(resume_text)
    divisions = add_section_breaks(cleaned_text)
    ready_text = sections(divisions)
    resume_text = " ".join([
    " ".join(ready_text.get("education", [])),
    " ".join(ready_text.get("experience", [])),
    " ".join(ready_text.get("projects", [])),
    " ".join(ready_text.get("technical_skills", [])),
    " ".join(ready_text.get("soft_skills", [])),
    " ".join(ready_text.get("certifications", []))
])

    resume_info_text = re.sub(r'\s+', ' ', resume_text).strip()

    job_description_text = clean_text(job_description)
    job_description_text = remove_unwanted(job_description_text)
    job_description_text = re.sub(r'\s+', ' ', job_description_text).strip()

    return resume_info_text,job_description_text

