from fastapi import APIRouter

from app.services.response import ok

router = APIRouter()


@router.get("/health")
def health() -> dict[str, object]:
    return ok({"status": "ok"}, "Service is healthy")
