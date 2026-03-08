from langflow_client import call_skill_flow
import re

def extract_skills(text):

    prompt = f"""
Extract ONLY professional skills from the following text.

Text:
{text}

Return skills as a comma separated list.
Do not explain anything.
Do not add sentences.
"""

    response = call_skill_flow(prompt)

    skills = response.split(",")

    cleaned = []

    for skill in skills:
        skill = skill.lower()
        skill = re.sub(r'[^a-z0-9 ]', ' ', skill)
        skill = re.sub(r'\s+', ' ', skill).strip()
        cleaned.append(skill)

    return set(cleaned)
