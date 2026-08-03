import environ
import os
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from .ai_schemas import SubjectTreeSchema

env = environ.Env()
environ.Env.read_env(os.path.join(settings.BASE_DIR, '.env'))


def generate_syllabus_tree(syllabus_text):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.3,
    )
    structured_llm = llm.with_structured_output(SubjectTreeSchema)

    prompt = f"""You are analyzing a university course syllabus. Extract it into a structured
    learning path of topics that could be taught in order.
    Rules:
    - Break the syllabus into 8-20 distinct topics (not too granular, not too broad).
    - Each topic's prerequisites must reference topic names that also appear in your output.
    - Order topics roughly in the sequence they'd be learned.
    - Exactly one topic should be marked is_boss=true: the most advanced/capstone topic.
    - Base estimated_hours and difficulty on the actual content described in the syllabus.

    Syllabus text:
    {syllabus_text}
    """

    result = structured_llm.invoke(prompt)
    return result