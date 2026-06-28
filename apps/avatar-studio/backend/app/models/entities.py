from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))


class Project(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "projects"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    prompt: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(50), default="DRAFT")

    scenes: Mapped[list["Scene"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class Avatar(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "avatars"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    language: Mapped[str] = mapped_column(String(50), default="English")
    gender: Mapped[str] = mapped_column(String(20), default="other")
    style: Mapped[str] = mapped_column(String(50), default="professional")
    clone_status: Mapped[str] = mapped_column(String(50), default="PENDING")


class AvatarTraining(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "avatar_training"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    avatar_id: Mapped[str | None] = mapped_column(ForeignKey("avatars.id"), nullable=True)
    avatar_name: Mapped[str] = mapped_column(String(120))
    mode: Mapped[str] = mapped_column(String(40), default="clone")
    current_stage: Mapped[str] = mapped_column(String(80), default="UPLOADING")
    progress_percent: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), default="QUEUED")

    logs: Mapped[list["TrainingLog"]] = relationship(back_populates="training", cascade="all, delete-orphan")


class TrainingLog(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "training_logs"

    training_id: Mapped[str] = mapped_column(ForeignKey("avatar_training.id"), index=True)
    stage: Mapped[str] = mapped_column(String(80))
    message: Mapped[str] = mapped_column(Text)

    training: Mapped[AvatarTraining] = relationship(back_populates="logs")


class VoiceProfile(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "voice_profiles"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    language: Mapped[str] = mapped_column(String(50), default="English")
    status: Mapped[str] = mapped_column(String(50), default="READY")


class Video(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "videos"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), index=True)
    status: Mapped[str] = mapped_column(String(50), default="QUEUED")
    resolution: Mapped[str] = mapped_column(String(20), default="1080p")
    output_url: Mapped[str] = mapped_column(Text, default="")


class Scene(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "scenes"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), index=True)
    order_index: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(255), default="Scene")
    narration: Mapped[str] = mapped_column(Text, default="")
    duration_seconds: Mapped[int] = mapped_column(Integer, default=10)
    background: Mapped[str] = mapped_column(String(120), default="office")

    project: Mapped[Project] = relationship(back_populates="scenes")


class Media(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "media"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), index=True)
    kind: Mapped[str] = mapped_column(String(40))
    file_url: Mapped[str] = mapped_column(Text)


class Template(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "templates"

    name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[str] = mapped_column(String(80), default="general")
    payload: Mapped[str] = mapped_column(Text, default="{}")


class BrandAsset(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "brand_assets"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    kind: Mapped[str] = mapped_column(String(40))
    file_url: Mapped[str] = mapped_column(Text)


class Job(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "jobs"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    job_type: Mapped[str] = mapped_column(String(50), index=True)
    status: Mapped[str] = mapped_column(String(50), default="QUEUED")
    ref_id: Mapped[str] = mapped_column(String(120), default="")


class Export(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "exports"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), index=True)
    format: Mapped[str] = mapped_column(String(30), default="mp4")
    file_url: Mapped[str] = mapped_column(Text, default="")


class Usage(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "usage"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    metric: Mapped[str] = mapped_column(String(60), index=True)
    amount: Mapped[int] = mapped_column(Integer, default=0)


class Upload(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "uploads"

    training_id: Mapped[str] = mapped_column(ForeignKey("avatar_training.id"), index=True)
    upload_type: Mapped[str] = mapped_column(String(30))
    filename: Mapped[str] = mapped_column(String(255))
    storage_url: Mapped[str] = mapped_column(Text)
    completed: Mapped[bool] = mapped_column(Boolean, default=True)
