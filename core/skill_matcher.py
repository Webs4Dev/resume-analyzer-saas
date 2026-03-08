from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def semantic_match(resume_skills, jd_skills):

    resume_list = list(resume_skills)
    jd_list = list(jd_skills)

    resume_embeddings = model.encode(resume_list, convert_to_tensor=True)
    jd_embeddings = model.encode(jd_list, convert_to_tensor=True)

    matched = set()
    missing = set(jd_list)

    for i in range(len(jd_list)):

        scores = util.cos_sim(jd_embeddings[i], resume_embeddings)

        if scores.max().item() > 0.45:  
            matched.add(jd_list[i])
            missing.discard(jd_list[i])

    return matched, missing