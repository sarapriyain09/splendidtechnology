from pydantic import BaseModel, Field


class TrainingStartRequest(BaseModel):
    avatar_name: str = Field(min_length=2, max_length=120)
    mode: str = "clone"


class TrainingLogCreate(BaseModel):
    stage: str
    message: str


class TrainingUploadMeta(BaseModel):
    upload_type: str
    filename: str
    storage_url: str


class ResumableUploadInitRequest(BaseModel):
    upload_type: str
    filename: str
    total_chunks: int
    content_type: str = "application/octet-stream"


class ResumableUploadCompleteRequest(BaseModel):
    upload_id: str
