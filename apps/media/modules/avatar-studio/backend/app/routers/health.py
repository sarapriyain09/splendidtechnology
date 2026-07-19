from fastapi import APIRouter

from app.providers.avatar_animation.factory import get_avatar_animation_policy_health

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/health")
def api_health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/animation")
def animation_health() -> dict[str, object]:
    health = get_avatar_animation_policy_health()
    overall_status = "ok" if bool(health.get("ready")) else "degraded"
    return {
        "status": overall_status,
        "animation": health,
    }


@router.get("/api/health/animation")
def api_animation_health() -> dict[str, object]:
    return animation_health()
