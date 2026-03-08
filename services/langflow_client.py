import requests
import uuid
from dotenv import load_dotenv
import os

load_dotenv()
OPEN_AI_API = os.getenv("OPEN_AI_API")
LANGFLOW_API_KEY = os.getenv("LANGFLOW_API_KEY")
LANGFLOW_FLOW_URL = os.getenv("LANGFLOW_FLOW_URL")
SKILL_FLOW_URL = os.getenv("SKILL_FLOW_URL")

def call_skill_flow(prompt: str):

    payload = {
        "input_type": "text",
        "output_type": "text",
        "input_value": prompt
    }

    headers = {
        "x-api-key": LANGFLOW_API_KEY,
    }

    response = requests.post(
        SKILL_FLOW_URL,
        headers=headers,
        json=payload
    )

    data = response.json()

    return (
        data["outputs"][0]
        ["outputs"][0]
        ["results"]["text"]["data"]["text"]
    )

def call_langflow(prompt: str) -> str:

    payload = {
        "input_type": "text",
        "output_type": "chat",
        "input_value": prompt,
        "session_id": str(uuid.uuid4())
    }

    headers = {
        "x-api-key":f"{LANGFLOW_API_KEY}",
    }

    try:
        response = requests.post(
            LANGFLOW_FLOW_URL,
            headers=headers,     
            json=payload,
            timeout=60
        )

        if response.status_code != 200:
            return f"Langflow error: HTTP {response.status_code}"

        data = response.json()

        return (
            data["outputs"][0]
                ["outputs"][0]
                ["results"]["text"]["data"]["text"]
        )

    except Exception as e:
        return str(e)

def build_langflow_prompt(details: dict) -> str:
    return f"""
        Match Percentage: {details['match_percentage']}%
        Verdict: {details['verdict']}

        Missing Technical Skills:
        {', '.join(details['missing_technical_skills'])}

        Learning Recommendations:
        {', '.join(details['learning_recommendations'])}

        Soft Skill Feedback:
        {', '.join(details['soft_skill_feedback']) if details['soft_skill_feedback'] else 'None'}
        """

