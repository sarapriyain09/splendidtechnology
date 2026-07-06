from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterCompanyRequest
from app.services.auth_service import login, logout, refresh_tokens, register_company
from app.services.dependencies import get_current_user
from app.services.response import ok

router = APIRouter()


@router.post("/register-company")
def register_company_route(payload: RegisterCompanyRequest, db: Session = Depends(get_db)) -> dict[str, object]:
    tokens, user, role = register_company(db, payload)
    return ok(
        {
            "tokens": tokens,
            "user": {
                "id": user.id,
                "company_id": user.company_id,
                "full_name": user.full_name,
                "email": user.email,
                "role": role,
            },
        },
        "Company registered successfully",
    )


@router.post("/login")
def login_route(payload: LoginRequest, db: Session = Depends(get_db)) -> dict[str, object]:
    tokens, user, role = login(db, payload)
    return ok(
        {
            "tokens": tokens,
            "user": {
                "id": user.id,
                "company_id": user.company_id,
                "full_name": user.full_name,
                "email": user.email,
                "role": role,
            },
        },
        "Login successful",
    )


@router.post("/refresh")
def refresh_route(payload: RefreshRequest, db: Session = Depends(get_db)) -> dict[str, object]:
    tokens, user, role = refresh_tokens(db, payload.refresh_token)
    return ok(
        {
            "tokens": tokens,
            "user": {
                "id": user.id,
                "company_id": user.company_id,
                "full_name": user.full_name,
                "email": user.email,
                "role": role,
            },
        },
        "Token refreshed",
    )


@router.post("/logout")
def logout_route(
    payload: RefreshRequest,
    current=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    logout(db, company_id=current.company_id, user_id=current.user_id, raw_refresh_token=payload.refresh_token)
    return ok({}, "Logout successful")


@router.get("/me")
def me_route(current=Depends(get_current_user)) -> dict[str, object]:
    return ok(
        {
            "id": current.user_id,
            "company_id": current.company_id,
            "full_name": current.full_name,
            "email": current.email,
            "role": current.role,
        },
        "Current user profile",
    )
