from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import Base  # noqa: F401
from app.routers import avatars, chat, health, projects, timeline, training

app = FastAPI(title="Velynxia Avatar Studio API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(avatars.router, prefix="/api/avatars", tags=["avatars"])
app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["timeline"])
