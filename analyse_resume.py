from get_skills import *
from recommandation import *
from langflow_client import *

def analyze_resume(resume_text: str, jd_text: str):

    resume_skills, jd_skills = get_skills(resume_text, jd_text)

    matched, missing_skills, extra, match_percentage = skill_gap_analysis(
        resume_skills, jd_skills
    )
    missing_tech,missing_soft = categorize_skills(missing_skills)
    verdict = give_verdict(match_percentage)

    recommendations, soft_feedback = learning_recommendations(
        missing_tech, missing_soft
    )

    ats = {
        "match_percentage": round(match_percentage,2),
        "verdict": verdict,
        "matched_skills": list(matched),
        "missing_skills": list(missing_skills),
        "extra_skills": list(extra),
        "learning_recommendations": recommendations,
        "soft_skill_feedback": soft_feedback
    }

    ats_summary = f"""
You are tailoring this resume for the following job description.

JOB DESCRIPTION:
{jd_text}

CURRENT ATS ANALYSIS:
Match Percentage: {round(match_percentage,2)}%
Verdict: {verdict}

Matched Skills:
{', '.join(matched)}

Missing Technical Skills:
{', '.join(missing_tech)}

Learning Recommendations:
{', '.join(recommendations)}

Soft Skill Feedback:
{', '.join(soft_feedback)}

Your task is to modify the resume content 
to better match this specific job description.
"""

    ai_feedback = call_langflow(ats_summary)

    return ats, ai_feedback