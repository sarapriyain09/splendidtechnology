from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.core.config import get_settings
from app.db.session import init_db
from app.services.discovery_connectors import DiscoveryConnectorService

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    DiscoveryConnectorService.configure_from_settings(settings)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-Id") or str(uuid4())
    request.state.correlation_id = correlation_id

    response = await call_next(request)
    response.headers["X-Correlation-Id"] = correlation_id
    return response

app.include_router(api_router, prefix=settings.api_prefix)
