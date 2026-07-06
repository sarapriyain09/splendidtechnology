from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Membership, User
from app.services.security import TokenError, decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@dataclass
class CurrentUser:
    user_id: str
    company_id: str
    email: str
    full_name: str
    role: str


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> CurrentUser:
    try:
        payload = decode_token(token)
    except TokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    if payload.get("typ") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    company_id = payload.get("company_id")
    if not user_id or not company_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.scalar(
        select(User).where(
            User.id == user_id,
            User.company_id == company_id,
            User.deleted_at.is_(None),
            User.is_active.is_(True),
        )
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    membership = db.scalar(
        select(Membership).where(
            Membership.user_id == user.id,
            Membership.company_id == company_id,
            Membership.deleted_at.is_(None),
        )
    )
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Membership not found")

    return CurrentUser(
        user_id=user.id,
        company_id=company_id,
        email=user.email,
        full_name=user.full_name,
        role=membership.role,
    )


def require_roles(*roles: str):
    allowed = set(roles)

    def checker(current: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current

    return checker
