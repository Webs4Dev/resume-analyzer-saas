from get_skills import *
from langflow_client import *
from ai_skill_extractor import extract_skills

def analyze_resume(resume_text: str, jd_text: str):

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched, missing_skills, match_percentage = skill_gap_analysis(
        resume_skills, jd_skills
    )
    

    ats = {
        "match_percentage": round(match_percentage,2),
        "matched_skills": list(matched),
        "missing_skills": list(missing_skills),
    }

    ats_summary = f"""
You are an ATS Resume Analyzer.

JOB DESCRIPTION:
{jd_text}

MATCHED SKILLS:
{', '.join(matched)}

MISSING SKILLS:
{', '.join(missing_skills)}

IMPORTANT:
Return COMPLETE detailed content.

Return ONLY in this format:

[MATCHED SKILLS]
List the skills the candidate already has that match the job.

[MISSING SKILLS]
List the important job skills missing from the resume.

[SUGGESTED PROJECTS]
Suggest 2 projects to help gain missing technical skills.

[TAILORED PROFESSIONAL SUMMARY]
Write a 3-4 line professional summary aligned to the job.

[ACTION PLAN]
Write 4 numbered steps to improve ATS score.
"""
    ai_feedback = call_langflow(ats_summary)

    return ats, ai_feedback