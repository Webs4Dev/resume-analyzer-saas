from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def vectorize(resume_text,job_description_text):
    corpus = [
    resume_text,
    job_description_text
    ]

    vectorizer = TfidfVectorizer(
        stop_words=None,
        ngram_range=(1, 2),
        token_pattern=r"(?u)\b\w+\b"
    )

    tfidf_matrix = vectorizer.fit_transform(corpus)
    resume_vector = tfidf_matrix[0]
    jd_vector = tfidf_matrix[1]

    return  resume_vector,jd_vector

def cosine_sim(resume_vector,jd_vector):
    similarity_score = cosine_similarity(
    resume_vector,
    jd_vector
    )[0][0]

    return similarity_score
