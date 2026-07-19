from pydantic import BaseModel, Field


class ScenePlanItem(BaseModel):
    title: str
    narration: str
    durationSeconds: int = Field(default=20, ge=1, le=600)
    background: str = "office"
    transition: str = "cut"
    avatar: str = "default"
    voice: str = "default"
    camera: str = "static"
    music: str = "none"
    captionStyle: str = "default"
    assets: list[str] = []


class ScenePlan(BaseModel):
    scenes: list[ScenePlanItem]
    sourcePrompt: str
