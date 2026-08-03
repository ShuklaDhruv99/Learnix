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