from pydantic import BaseModel, Field


class PromptRequest(BaseModel):
    prompt: str = Field(min_length=5)
    avatar_id: str | None = None
    project_name: str = "AI Generated Project"
