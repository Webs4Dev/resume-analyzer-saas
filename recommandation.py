import re

def learning_recommendations(missing_technical,missing_soft):
    recommendations = []
    soft_skill_feedback = []

    for skill in missing_technical:
        if skill in learning_map:
            recommendations.append(learning_map[skill])

    if missing_soft:
        soft_skill_feedback.append(
            "Consider highlighting soft skills like " +
            ", ".join(list(missing_soft)[:3]) +
            " through project descriptions or teamwork examples."
        )

    
    return recommendations,soft_skill_feedback

def resume_tips(missing_technical, extra_skills, match_percentage):
    resume_tips = []

    if match_percentage < 50:
        resume_tips.append("Your resume lacks key technical skills required for the role.")

    if missing_technical:
        resume_tips.append(
            "Add projects demonstrating: " + ", ".join(list(missing_technical)[:3])
        )

    if extra_skills:
        resume_tips.append(
            "Rephrase extra skills to align with job keywords instead of removing them."
        )

    return resume_tips

def give_verdict(match_percentage):
    if match_percentage >= 75:
        verdict = "Strong fit for the role"
    elif match_percentage >= 50:
        verdict = "Moderate fit, needs skill improvement"
    else:
        verdict = "Low fit, significant upskilling required"

    return verdict

learning_map = {
    "python": "Strengthen Python fundamentals, OOP concepts, and write clean modular code through mini-projects",
    "java": "Revise core Java, OOP principles, and basic multithreading concepts",
    "c++": "Practice STL, pointers, memory management, and problem-solving",
    "data structures": "Practice arrays, linked lists, stacks, queues, trees, and hash maps with coding problems",
    "algorithms": "Learn sorting, searching, recursion, greedy algorithms, and basic dynamic programming",
    "sql": "Learn SQL joins, subqueries, indexes, and practice queries on real datasets",
    "mysql": "Practice database design, normalization, and CRUD operations",
    "mongodb": "Learn NoSQL concepts, collections, and schema design",
    "data analysis": "Practice data cleaning, filtering, and basic exploratory data analysis",
    "html": "Build structured web pages using semantic HTML",
    "css": "Learn Flexbox, Grid, and responsive design techniques",
    "javascript": "Practice DOM manipulation, events, and async JavaScript",
    "react": "Build component-based UIs and learn state management",
    "flask": "Build REST APIs and connect backend logic with databases",
    "django": "Learn MVC architecture and build full-stack web applications",
    "api": "Practice consuming and building REST APIs using HTTP methods",
    "rest api": "Understand REST principles, status codes, and authentication",
    "http": "Learn HTTP request-response cycle and headers",
    "networking": "Understand TCP/IP basics, DNS, and client-server architecture",
    "docker": "Learn containerization and deploy a Python application using Docker",
    "aws": "Start with AWS EC2, S3, and IAM fundamentals",
    "cloud computing": "Understand cloud service models like IaaS, PaaS, SaaS",
    "ci/cd": "Learn automated build and deployment pipelines",
    "linux": "Practice Linux commands, file permissions, and shell scripting",
    "machine learning": "Learn supervised and unsupervised learning with hands-on projects",
    "deep learning": "Understand neural networks and implement simple models",
    "nlp": "Practice text preprocessing, TF-IDF, and similarity-based models",
    "tf-idf": "Understand term weighting and document similarity computation",
    "cosine similarity": "Apply similarity measures for recommendation systems",
    "git": "Learn version control, branching, and collaborative workflows",
    "github": "Host projects, manage repositories, and write README files",
    "testing": "Learn unit testing and debugging techniques",
    "software design": "Understand modular design, clean code, and design principles",
    "cybersecurity": "Learn basic security concepts like authentication and encryption",
    "blockchain": "Understand blockchain fundamentals and smart contracts",
    "iot": "Work with sensors, microcontrollers, and IoT architectures"
}
