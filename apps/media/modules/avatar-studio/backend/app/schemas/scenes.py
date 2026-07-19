from pydantic import BaseModel


class SceneCreate(BaseModel):
    title: str
    narration: str
    duration_seconds: int = 10
    background: str = "office"
    image_url: str = ""
    voice_audio_url: str = ""
    music: str = "none"
    camera: str = "static"
    transition: str = "cut"
    caption_style: str = "default"
    voice: str = "default"
    assets: list[str] = []


class SceneUpdate(BaseModel):
    title: str | None = None
    narration: str | None = None
    duration_seconds: int | None = None
    background: str | None = None
    image_url: str | None = None
    voice_audio_url: str | None = None
    music: str | None = None
    order_index: int | None = None
    camera: str | None = None
    transition: str | None = None
    caption_style: str | None = None
    voice: str | None = None
    assets: list[str] | None = None


class SceneRenderRequest(BaseModel):
    avatar_id: str | None = None
    idempotency_key: str | None = None
