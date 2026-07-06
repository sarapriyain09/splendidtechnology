from sqlalchemy.orm import Session

from app.models import User

DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001"


def ensure_default_user(db: Session) -> User:
    user = db.get(User, DEFAULT_USER_ID)
    if user:
        return user

    user = User(id=DEFAULT_USER_ID, email="owner@velynxia.com", full_name="Velynxia Owner")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
