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
    explanation: str = Field(description="Brief explanation of why the correct answer is right")

class QuizSchema(BaseModel):
    questions: List[QuizQuestionSchema] = Field(description="Exactly 5 quiz questions")

class TopicSummarySchema(BaseModel):
    key_concepts: List[str] = Field(description="3-5 short bullet points of the most important concepts in this topic")
    summary: str = Field(description="A clear, concise 3-4 sentence explanation of what this topic covers and why it matters")