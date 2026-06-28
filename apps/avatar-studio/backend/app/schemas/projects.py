from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    prompt: str = ""


class SceneOut(BaseModel):
    id: str
    order_index: int
    title: str
    narration: str
    duration_seconds: int


class ProjectOut(BaseModel):
    id: str
    name: str
    prompt: str
    status: str
