import environ
import os
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from .ai_schemas import SubjectTreeSchema, QuizSchema, TopicSummarySchema
from django.db import transaction
from .models import Subject, Topic

env = environ.Env()
environ.Env.read_env(os.path.join(settings.BASE_DIR, '.env'))


def generate_syllabus_tree(syllabus_text):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
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

def validate_topic_tree(tree: SubjectTreeSchema):
    """
    Returns (is_valid, error_message). Checks:
    1. Every prerequisite name refers to an actual topic in the tree.
    2. No circular dependencies (the prerequisite graph is a DAG).
    """
    topic_names = {t.name for t in tree.topics}

    for topic in tree.topics:
        for prereq in topic.prerequisites:
            if prereq not in topic_names:
                return False, f"Topic '{topic.name}' lists unknown prerequisite '{prereq}'."

    graph = {t.name: t.prerequisites for t in tree.topics}
    visiting = set()
    visited = set()

    def has_cycle(node):
        if node in visiting:
            return True
        if node in visited:
            return False
        visiting.add(node)
        for prereq in graph.get(node, []):
            if has_cycle(prereq):
                return True
        visiting.remove(node)
        visited.add(node)
        return False

    for name in topic_names:
        if has_cycle(name):
            return False, f"Circular dependency detected involving '{name}'."

    return True, None

from django.db import transaction
from .models import Subject, Topic


@transaction.atomic
def save_generated_tree(tree: SubjectTreeSchema, university=None, branch=None, semester=None):
    """
    Persist a validated SubjectTreeSchema as real Subject/Topic rows.
    Returns the created Subject instance.
    """
    subject = Subject.objects.create(
        name=tree.subject_name,
        university=university,
        branch=branch,
        semester=semester,
        estimated_hours=sum(t.estimated_hours for t in tree.topics),
    )

    # First pass: create all Topic rows (without prerequisites yet, since
    # prerequisites reference other topics that must already exist to link to)
    name_to_topic = {}
    for t in tree.topics:
        topic = Topic.objects.create(
            subject=subject,
            name=t.name,
            description=t.description,
            estimated_hours=t.estimated_hours,
            difficulty=t.difficulty,
            xp=t.xp,
            is_boss=t.is_boss,
        )
        name_to_topic[t.name] = topic

    # Second pass: wire up prerequisites now that every Topic row exists
    for t in tree.topics:
        if t.prerequisites:
            topic = name_to_topic[t.name]
            prereq_objs = [name_to_topic[p] for p in t.prerequisites]
            topic.prerequisites.set(prereq_objs)

    return subject

def generate_quiz(topic_name, topic_description, difficulty, goal_mode, num_questions=5):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.5,
    )
    structured_llm = llm.with_structured_output(QuizSchema)

    goal_hint = {
        'pass': 'Keep questions basic and focused on core definitions and facts.',
        'average': 'Mix basic recall questions with a couple of applied/practical questions.',
        'topper': 'Include analytical, applied, and edge-case questions that test deep understanding, not just recall.',
    }.get(goal_mode, 'Mix basic and applied questions.')

    prompt = f"""Generate a {num_questions}-question multiple choice quiz for the topic "{topic_name}".

    Topic description: {topic_description}
    Topic difficulty level: {difficulty}
    Student goal level: {goal_mode or 'average'}

    {goal_hint}

    Each question must have exactly 4 options, one correct answer (by index), and a brief explanation.
    Base question difficulty on both the topic's difficulty level and the student goal guidance above.
    Vary the questions so no two test the exact same fact.
    """ 

    return structured_llm.invoke(prompt)

def generate_topic_summary(topic_name, topic_description, difficulty):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.3,
    )
    structured_llm = llm.with_structured_output(TopicSummarySchema)

    prompt = f"""Write a clear study overview for the topic "{topic_name}" (difficulty: {difficulty}).

    Topic description: {topic_description}

    Provide a short summary explaining the topic simply, plus 3-5 key concepts as bullet points.
    Keep the tone clear and educational, suitable for a student encountering this topic.
    """

    return structured_llm.invoke(prompt)

from .ai_schemas import TopicTutorialSchema


def generate_topic_tutorial(topic_name, topic_description, difficulty, subject_name=""):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.4,
    )
    structured_llm = llm.with_structured_output(TopicTutorialSchema)

    prompt = f"""Write a comprehensive, in-depth study tutorial for the topic "{topic_name}"{f' (part of {subject_name})' if subject_name else ''}.

    Topic description: {topic_description}
    Difficulty: {difficulty}

    This should be as thorough as a textbook chapter or a detailed lecture handout — do not write a
    brief overview. Structure your response as:

    1. Concept: a clear, fairly detailed plain-English explanation of what this topic is, why it
    matters, and where it's commonly used (3-5 sentences).

    2. Key Points: cover EVERY meaningfully distinct way, variant, method, or sub-case related to this
    topic — not just the most common one. If the topic name or description implies multiple
    approaches (e.g. "using X, Y, or Z"), each approach must get its own key point with its own
    code snippet. Aim for 6-10 key points. Each must include a working code snippet and a bullet
    list of any relevant parameters (name, type, default, purpose) where applicable.

    3. Examples: provide 4-6 progressively more advanced worked examples, each with a clear
    description, complete runnable code, and the exact expected output. Do not repeat the same
    scenario as the Key Points — examples should show these concepts combined or applied to
    realistic situations.

    If this is a conceptual/non-code topic, keep code snippets empty where not applicable and instead
    go deeper on explanation, real-world analogies, and conceptual examples.
    """
    
    return structured_llm.invoke(prompt)

def generate_mock_exam(subject_name, topics, goal_mode, num_questions=15):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.6,
    )
    structured_llm = llm.with_structured_output(QuizSchema)

    goal_hint = {
        'pass': 'Keep questions basic and focused on core definitions and facts.',
        'average': 'Mix basic recall questions with a couple of applied/practical questions.',
        'topper': 'Include analytical, applied, and edge-case questions that test deep understanding, not just recall.',
    }.get(goal_mode, 'Mix basic and applied questions.')

    topics_list = "\n".join(f"- {t['name']} ({t['difficulty']}): {t['description']}" for t in topics)

    prompt = f"""Generate a {num_questions}-question mock exam covering the ENTIRE subject "{subject_name}".

    The subject has these topics:
    {topics_list}

    Distribute the {num_questions} questions across these topics so the exam reasonably covers the
    full syllabus rather than focusing on just one or two topics.

    Student goal level: {goal_mode or 'average'}
    {goal_hint}

    Each question must have exactly 4 options, one correct answer (by index), a brief explanation,
    and the exact "topic_name" (copied from the list above) that it covers.
    """

    return structured_llm.invoke(prompt)