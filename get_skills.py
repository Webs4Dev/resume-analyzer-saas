import re
from skill_matcher import semantic_match



def skill_gap_analysis(resume_skills, jd_skills):
    matched_skills, missing_skills = semantic_match(resume_skills, jd_skills)
    if len(jd_skills) == 0:
        match_percentage = 0
    else:
        match_percentage = (len(matched_skills) / len(jd_skills)) * 100

    return matched_skills, missing_skills, match_percentage



