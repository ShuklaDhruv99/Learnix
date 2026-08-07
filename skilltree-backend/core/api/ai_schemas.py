from pydantic import BaseModel, Field
from typing import List


class TopicSchema(BaseModel):
    name: str = Field(description="Short topic name, e.g. 'Recursion'")
    description: str = Field(description="1-2 sentence explanation of what this topic covers")
    prerequisites: List[str] = Field(
        description="Names of other topics (from this same list) that must be learned first. Empty list if none."
    )
    estimated_hours: int = Field(description="Realistic hours needed to learn this topic")
    difficulty: str = Field(description="One of: Easy, Medium, Hard")
    xp: int = Field(description="XP reward, roughly estimated_hours * 20")
    is_boss: bool = Field(description="True only for the single final/capstone topic of the subject, false for all others")


class SubjectTreeSchema(BaseModel):
    subject_name: str = Field(description="Name of the overall subject/course")
    topics: List[TopicSchema] = Field(description="Ordered list of topics covering the full syllabus")

class QuizQuestionSchema(BaseModel):
    question: str = Field(description="The question text")
    options: List[str] = Field(description="Exactly 4 answer options")
    correct_index: int = Field(description="Index (0-3) of the correct option in the options list")
    solution_steps: List[str] = Field(description="3-5 general steps describing the approach to solve this question, without specific numbers yet")
    worked_solution: List[str] = Field(description="The same steps worked through with actual values/code/calculations from this specific question, showing how you arrive at the answer")
    why_correct: str = Field(description="1-2 sentences directly explaining why the correct option is right")
    topic_name: str = Field(default="", description="Name of the specific topic this question covers, for multi-topic exams; empty otherwise")

class QuizSchema(BaseModel):
    questions: List[QuizQuestionSchema] = Field(description="The quiz questions, matching the exact count requested in the prompt")

class TopicSummarySchema(BaseModel):
    key_concepts: List[str] = Field(description="3-5 short bullet points of the most important concepts in this topic")
    summary: str = Field(description="A clear, concise 3-4 sentence explanation of what this topic covers and why it matters")

class KeyPointSchema(BaseModel):
    title: str = Field(description="Short name of this key point or variant")
    explanation: str = Field(description="1-2 sentence explanation of this specific point")
    is_code: bool = Field(default=False, description="True if the 'code' field contains actual code; False if it contains prose/explanation text or is empty")
    code: str = Field(default="", description="A short code snippet OR a prose example, depending on is_code. Empty string if not applicable.")
    details: List[str] = Field(default_factory=list, description="Optional bullet list of parameters/details/key facts")


class TutorialExampleSchema(BaseModel):
    title: str = Field(description="Short title for this example")
    description: str = Field(description="What this example demonstrates")
    is_code: bool = Field(default=True, description="True if 'code' and 'output' contain actual code/program output; False if they contain prose (a worked scenario and its takeaway)")
    code: str = Field(description="The example code, OR a worked-through prose answer if is_code is False")
    output: str = Field(description="The expected program output, OR the concluding result/takeaway if is_code is False")


class TopicTutorialSchema(BaseModel):
    concept: str = Field(description="A clear, plain-English explanation of what this topic is and why it matters (3-5 sentences)")
    key_points: List[KeyPointSchema] = Field(description="6-10 key points, variants, sub-cases, or distinct approaches to this topic — be thorough and cover every meaningfully different way to approach it, each with a code snippet where applicable")
    examples: List[TutorialExampleSchema] = Field(description="4-6 worked examples with real code and expected output, progressing from basic to more advanced usage")

class CodeQuestionSchema(BaseModel):
    problem_statement: str = Field(description="A clear, practical problem or application question for this topic")
    is_code: bool = Field(default=True, description="True if this is a coding problem; False if it's a written/applied problem")
    starter_code: str = Field(default="", description="Optional starter code or scaffold, if this is a coding topic. Empty string otherwise.")
    solution_code: str = Field(description="A complete model answer: real code if is_code is True, or a well-written prose model response if is_code is False")
    solution_explanation: str = Field(description="A clear explanation of how the model answer was reached, step by step")


class CodePracticeSetSchema(BaseModel):
    questions: List[CodeQuestionSchema] = Field(description="The coding practice questions, matching the exact count requested")