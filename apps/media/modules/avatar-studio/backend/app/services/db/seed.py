from sqlalchemy.orm import Session

from app.models import User

DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001"


def ensure_default_user(db: Session) -> User:
    return ensure_user(db, DEFAULT_USER_ID, "owner@velynxia.com", "Velynxia Owner")


def ensure_user(
    db: Session,
    user_id: str,
    email: str | None = None,
    full_name: str | None = None,
) -> User:
    user = db.get(User, user_id)
    if user:
        return user

    user = User(
        id=user_id,
        email=email or f"{user_id}@avatar.local",
        full_name=full_name or "Avatar Studio User",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
