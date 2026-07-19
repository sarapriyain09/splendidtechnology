from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Avatar
from app.security import RequestActor, get_request_actor
from app.services.db.seed import ensure_user

router = APIRouter()


def _to_avatar_payload(avatar: Avatar) -> dict[str, str]:
    updated_at = avatar.updated_at if isinstance(avatar.updated_at, datetime) else datetime.now(UTC)
    return {
        "id": avatar.id,
        "name": avatar.name,
        "language": avatar.language,
        "style": avatar.style,
        "cloneStatus": avatar.clone_status,
        "imageUrl": f"https://api.dicebear.com/8.x/identicon/svg?seed={avatar.id}",
        "updatedAt": updated_at.isoformat(),
    }


def _ensure_seed_avatar(db: Session, user_id: str) -> None:
    existing = db.query(Avatar).filter(Avatar.user_id == user_id).first()
    if existing:
        return

    seed_avatar = Avatar(
        user_id=user_id,
        name="Emma",
        language="English",
        gender="female",
        style="Professional",
        clone_status="READY",
    )
    db.add(seed_avatar)
    db.commit()


class AvatarUpdatePayload(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    language: str | None = Field(default=None, min_length=1, max_length=50)
    style: str | None = Field(default=None, min_length=1, max_length=50)


@router.get("")
def list_avatars(
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, list[dict[str, str]]]:
    ensure_user(db, actor.user_id)
    _ensure_seed_avatar(db, actor.user_id)

    avatars = (
        db.query(Avatar)
        .filter(Avatar.user_id == actor.user_id)
        .order_by(Avatar.updated_at.desc())
        .all()
    )

    return {
        "avatars": [_to_avatar_payload(item) for item in avatars]
    }


@router.patch("/{avatar_id}")
def update_avatar(
    avatar_id: str,
    payload: AvatarUpdatePayload,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, dict[str, str]]:
    ensure_user(db, actor.user_id)
    avatar = db.query(Avatar).filter(Avatar.id == avatar_id, Avatar.user_id == actor.user_id).first()
    if not avatar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avatar not found")

    if payload.name is not None:
        avatar.name = payload.name.strip()
    if payload.language is not None:
        avatar.language = payload.language.strip()
    if payload.style is not None:
        avatar.style = payload.style.strip()

    db.add(avatar)
    db.commit()
    db.refresh(avatar)

    return {"avatar": _to_avatar_payload(avatar)}


@router.post("/{avatar_id}/duplicate")
def duplicate_avatar(
    avatar_id: str,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, dict[str, str]]:
    ensure_user(db, actor.user_id)
    avatar = db.query(Avatar).filter(Avatar.id == avatar_id, Avatar.user_id == actor.user_id).first()
    if not avatar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avatar not found")

    clone = Avatar(
        user_id=actor.user_id,
        name=f"{avatar.name} (Copy)",
        language=avatar.language,
        gender=avatar.gender,
        style=avatar.style,
        clone_status=avatar.clone_status,
    )
    db.add(clone)
    db.commit()
    db.refresh(clone)

    return {"avatar": _to_avatar_payload(clone)}


@router.delete("/{avatar_id}")
def delete_avatar(
    avatar_id: str,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    ensure_user(db, actor.user_id)
    avatar = db.query(Avatar).filter(Avatar.id == avatar_id, Avatar.user_id == actor.user_id).first()
    if not avatar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avatar not found")

    db.delete(avatar)
    db.commit()
    return {"status": "deleted", "id": avatar_id}
