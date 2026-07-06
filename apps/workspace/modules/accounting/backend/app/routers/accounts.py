from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.accounts import AccountCreate, AccountUpdate
from app.services.account_service import create_account, deactivate_account, list_accounts, update_account
from app.services.dependencies import CurrentUser, get_current_user, require_roles
from app.services.response import ok

router = APIRouter()


@router.get("")
def list_accounts_route(
    current: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    records = list_accounts(db, company_id=current.company_id)
    return ok(
        {
            "accounts": [
                {
                    "id": record.id,
                    "code": record.code,
                    "name": record.name,
                    "category": record.category,
                    "subtype": record.subtype,
                    "vat_rate": record.vat_rate,
                    "is_active": record.is_active,
                    "is_system": record.is_system,
                }
                for record in records
            ]
        },
        "Accounts retrieved",
    )


@router.post("")
def create_account_route(
    payload: AccountCreate,
    current: CurrentUser = Depends(require_roles("owner", "accountant", "manager")),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    record = create_account(db, company_id=current.company_id, actor_id=current.user_id, payload=payload)
    return ok(
        {
            "id": record.id,
            "code": record.code,
            "name": record.name,
            "category": record.category,
            "subtype": record.subtype,
            "vat_rate": record.vat_rate,
            "is_active": record.is_active,
            "is_system": record.is_system,
        },
        "Account created",
    )


@router.put("/{account_id}")
def update_account_route(
    account_id: str,
    payload: AccountUpdate,
    current: CurrentUser = Depends(require_roles("owner", "accountant", "manager")),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    record = update_account(
        db,
        company_id=current.company_id,
        actor_id=current.user_id,
        account_id=account_id,
        payload=payload,
    )
    return ok(
        {
            "id": record.id,
            "code": record.code,
            "name": record.name,
            "category": record.category,
            "subtype": record.subtype,
            "vat_rate": record.vat_rate,
            "is_active": record.is_active,
            "is_system": record.is_system,
        },
        "Account updated",
    )


@router.post("/{account_id}/deactivate")
def deactivate_account_route(
    account_id: str,
    current: CurrentUser = Depends(require_roles("owner", "accountant", "manager")),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    record = deactivate_account(
        db,
        company_id=current.company_id,
        actor_id=current.user_id,
        account_id=account_id,
    )
    return ok(
        {
            "id": record.id,
            "code": record.code,
            "name": record.name,
            "category": record.category,
            "subtype": record.subtype,
            "vat_rate": record.vat_rate,
            "is_active": record.is_active,
            "is_system": record.is_system,
        },
        "Account deactivated",
    )
