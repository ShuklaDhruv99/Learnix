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
    title: str = Field(description="Short name of this key point or variant, e.g. 'Using a List' or 'Named Parameters'")
    explanation: str = Field(description="1-2 sentence explanation of this specific point")
    code: str = Field(default="", description="A short code snippet demonstrating this point, if applicable. Empty string if not applicable.")
    details: List[str] = Field(default_factory=list, description="Optional bullet list of parameters/details, e.g. 'index: list, optional - custom row labels'")


class TutorialExampleSchema(BaseModel):
    title: str = Field(description="Short title for this example, e.g. 'Example 1: Basic Usage'")
    description: str = Field(description="What this example demonstrates")
    code: str = Field(description="The example code")
    output: str = Field(description="The expected output when the code is run")


class TopicTutorialSchema(BaseModel):
    concept: str = Field(description="A clear, plain-English explanation of what this topic is and why it matters (3-5 sentences)")
    key_points: List[KeyPointSchema] = Field(description="6-10 key points, variants, sub-cases, or distinct approaches to this topic — be thorough and cover every meaningfully different way to approach it, each with a code snippet where applicable")
    examples: List[TutorialExampleSchema] = Field(description="4-6 worked examples with real code and expected output, progressing from basic to more advanced usage")