import re

def get_skills(resume_text, jd_text):

    resume_text = resume_text.lower()
    jd_text = jd_text.lower()

    resume_skills = set()
    jd_skills = set()

    for skill in skill_vocabulary:

        skill_lower = skill.lower()

        if skill_lower in resume_text:
            resume_skills.add(skill)

        if skill_lower in jd_text:
            jd_skills.add(skill)

    return resume_skills, jd_skills

def skill_gap_analysis(resume_skills, jd_skills):
    matched_skills = resume_skills & jd_skills
    missing_skills = jd_skills - resume_skills
    extra_skills = resume_skills - jd_skills

    match_percentage = (
        (len(matched_skills) / len(jd_skills)) * 100
        if jd_skills else 0
    )

    return matched_skills, missing_skills, extra_skills, match_percentage

def categorize_skills(missing_skills):
    tech_skills = set(technical_skills_vocab)
    soft_skills = set(soft_skills_vocab)
    missing_technical = missing_skills & tech_skills
    missing_soft = missing_skills & soft_skills

    return missing_technical, missing_soft

programming_languages = [
    "python", "c", "c++", "java", "javascript"
]
ml_ai_skills = [
    "machine learning", "artificial intelligence", "ai",
    "data science", "deep learning",
    "nlp", "natural language processing"
]
python_libraries = [
    "numpy", "pandas", "matplotlib", "scikit-learn",
    "sklearn", "tensorflow", "pytorch"
]
backend_api_skills = [
    "api","rest api",
    "http", "https", "json"
]
database_skills = [
    "sql", "mysql", "postgresql", "mongodb"
]
os_dev_tools = [
    "linux", "git", "github", "command line",
    "shell", "bash"
]
cs_fundamentals = [
    "data structures", "algorithms",
    "arrays", "linked lists", "stacks", "queues"
]
web_skills = [
    "html", "html5", "css", "css3", "javascript", "js"
]
soft_skills_vocab = [
    "communication",
    "verbal communication",
    "written communication",
    "teamwork",
    "collaboration",
    "problem solving",
    "critical thinking",
    "analytical thinking",
    "decision making",
    "adaptability",
    "flexibility",
    "time management",
    "prioritization",
    "leadership",
    "initiative",
    "creativity",
    "innovation",
    "work ethic",
    "professionalism",
    "interpersonal skills",
    "presentation skills",
    "public speaking",
    "conflict resolution",
    "stress management",
    "attention to detail",
    "self learning",
    "continuous learning",
    "mentorship"
]

technical_skills_vocab = (
    programming_languages +
    ml_ai_skills +
    python_libraries +
    backend_api_skills +
    database_skills +
    os_dev_tools +
    cs_fundamentals +
    web_skills
)

skill_vocabulary = (
    programming_languages +
    ml_ai_skills +
    python_libraries +
    backend_api_skills +
    database_skills +
    os_dev_tools +
    cs_fundamentals +
    web_skills +
    soft_skills_vocab
)
