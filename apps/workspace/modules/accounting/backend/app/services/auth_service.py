from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Company, Membership, RefreshToken, User
from app.schemas.auth import LoginRequest, RegisterCompanyRequest
from app.services.account_service import seed_default_accounts
from app.services.audit import log_audit_event
from app.services.security import create_access_token, create_refresh_token, hash_password, hash_token, verify_password


def _issue_tokens(db: Session, user: User, role: str) -> dict[str, str]:
    access_token = create_access_token(user.id, user.company_id, role)
    raw_refresh = create_refresh_token()
    expires = datetime.utcnow() + timedelta(days=settings.refresh_token_exp_days)
    refresh = RefreshToken(
        company_id=user.company_id,
        created_by=user.id,
        updated_by=user.id,
        user_id=user.id,
        token_hash=hash_token(raw_refresh),
        expires_at=expires,
    )
    db.add(refresh)
    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
    }


def register_company(db: Session, payload: RegisterCompanyRequest) -> tuple[dict[str, str], User, str]:
    existing = db.scalar(select(User).where(User.email == payload.email, User.deleted_at.is_(None)))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    company = Company(
        company_id="bootstrap",
        created_by=payload.email,
        updated_by=payload.email,
        name=payload.company_name,
    )
    db.add(company)
    db.flush()
    company.company_id = company.id

    user = User(
        company_id=company.id,
        created_by=payload.email,
        updated_by=payload.email,
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        is_active=True,
    )
    db.add(user)
    db.flush()

    membership = Membership(
        company_id=company.id,
        created_by=user.id,
        updated_by=user.id,
        user_id=user.id,
        role="owner",
    )
    db.add(membership)

    seed_default_accounts(db, company_id=company.id, actor_id=user.id)

    log_audit_event(
        db,
        company_id=company.id,
        actor_id=user.id,
        action="auth.register_company",
        entity_type="company",
        entity_id=company.id,
        payload={"email": user.email},
    )

    tokens = _issue_tokens(db, user, membership.role)
    db.commit()
    db.refresh(user)
    return tokens, user, membership.role


def login(db: Session, payload: LoginRequest) -> tuple[dict[str, str], User, str]:
    user = db.scalar(select(User).where(User.email == payload.email, User.deleted_at.is_(None)))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    membership = db.scalar(
        select(Membership).where(
            Membership.user_id == user.id,
            Membership.company_id == user.company_id,
            Membership.deleted_at.is_(None),
        )
    )
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Membership not found")

    tokens = _issue_tokens(db, user, membership.role)
    log_audit_event(
        db,
        company_id=user.company_id,
        actor_id=user.id,
        action="auth.login",
        entity_type="user",
        entity_id=user.id,
    )
    db.commit()
    return tokens, user, membership.role


def refresh_tokens(db: Session, raw_refresh_token: str) -> tuple[dict[str, str], User, str]:
    token_hash = hash_token(raw_refresh_token)
    refresh = db.scalar(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
            RefreshToken.deleted_at.is_(None),
        )
    )
    if not refresh or refresh.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.scalar(
        select(User).where(
            User.id == refresh.user_id,
            User.company_id == refresh.company_id,
            User.deleted_at.is_(None),
            User.is_active.is_(True),
        )
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    membership = db.scalar(
        select(Membership).where(
            Membership.user_id == user.id,
            Membership.company_id == user.company_id,
            Membership.deleted_at.is_(None),
        )
    )
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Membership not found")

    refresh.revoked_at = datetime.utcnow()
    refresh.updated_by = user.id

    tokens = _issue_tokens(db, user, membership.role)
    log_audit_event(
        db,
        company_id=user.company_id,
        actor_id=user.id,
        action="auth.refresh",
        entity_type="user",
        entity_id=user.id,
    )
    db.commit()
    return tokens, user, membership.role


def logout(db: Session, *, company_id: str, user_id: str, raw_refresh_token: str) -> None:
    token_hash = hash_token(raw_refresh_token)
    refresh = db.scalar(
        select(RefreshToken).where(
            RefreshToken.company_id == company_id,
            RefreshToken.user_id == user_id,
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
            RefreshToken.deleted_at.is_(None),
        )
    )
    if refresh:
        refresh.revoked_at = datetime.utcnow()
        refresh.updated_by = user_id

    log_audit_event(
        db,
        company_id=company_id,
        actor_id=user_id,
        action="auth.logout",
        entity_type="user",
        entity_id=user_id,
    )
    db.commit()
