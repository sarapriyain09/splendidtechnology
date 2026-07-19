from contextlib import asynccontextmanager
import logging
from pathlib import Path
from time import perf_counter
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db.session import engine
from app.models import Base  # noqa: F401
from app.observability.request_context import reset_request_context, set_request_context
from app.routers import animate, avatars, chat, health, projects, timeline, training
from app.runtime import configure_logging, ensure_runtime_directories

logger = logging.getLogger("app.request")

@asynccontextmanager
async def lifespan(_: FastAPI):
    settings.validate_runtime()
    ensure_runtime_directories()
    configure_logging()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Velynxia Avatar Studio API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-Id") or uuid4().hex
    correlation_id = request.headers.get("X-Correlation-Id") or request_id
    tenant_id = request.headers.get("X-Tenant-Id", "-")
    user_id = request.headers.get("X-User-Id", "-")

    tokens = set_request_context(
        correlation_id=correlation_id,
        request_id=request_id,
        tenant_id=tenant_id,
        user_id=user_id,
    )
    started_at = perf_counter()
    try:
        response = await call_next(request)
    finally:
        elapsed_ms = int((perf_counter() - started_at) * 1000)
        logger.info(
            "%s %s completed in %sms",
            request.method,
            request.url.path,
            elapsed_ms,
        )
        reset_request_context(tokens)

    response.headers["X-Request-Id"] = request_id
    response.headers["X-Correlation-Id"] = correlation_id
    return response

app.include_router(health.router)
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(avatars.router, prefix="/api/avatars", tags=["avatars"])
app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["timeline"])
app.include_router(animate.router, prefix="/api/animate", tags=["animate"])

app.mount("/media", StaticFiles(directory=Path(settings.storage_root), check_dir=False), name="media")
