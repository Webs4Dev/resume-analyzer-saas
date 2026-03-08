from fastapi import FastAPI
from pydantic import BaseModel
from analyse_resume import analyze_resume
from pdf_loader import read_pdf, get_text
from fastapi import UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Resume vs JD Analyzer (Langflow)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/analyze-pdf")
async def analyze_pdf(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):

    with open(resume.filename, "wb") as f:
        f.write(await resume.read())

    raw_resume_text = read_pdf(resume.filename)
    
    resume_text, jd_text = get_text(
        raw_resume_text,
        job_description
    )

    result = analyze_resume(resume_text, jd_text)

    return result

