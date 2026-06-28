from pydantic import BaseModel


class SceneCreate(BaseModel):
    title: str
    narration: str
    duration_seconds: int = 10
    background: str = "office"


class SceneUpdate(BaseModel):
    title: str | None = None
    narration: str | None = None
    duration_seconds: int | None = None
    background: str | None = None
    order_index: int | None = None
