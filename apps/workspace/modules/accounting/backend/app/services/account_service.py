from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Account
from app.schemas.accounts import AccountCreate, AccountUpdate
from app.services.audit import log_audit_event


ALLOWED_ACCOUNT_CATEGORIES = {"assets", "liabilities", "equity", "income", "expenses"}

DEFAULT_UK_ACCOUNTS = [
    {"code": "1000", "name": "Current Bank Account", "category": "assets", "subtype": "bank", "vat_rate": "0%", "is_system": True},
    {"code": "1100", "name": "Accounts Receivable", "category": "assets", "subtype": "trade_debtors", "vat_rate": "0%", "is_system": True},
    {"code": "2000", "name": "Accounts Payable", "category": "liabilities", "subtype": "trade_creditors", "vat_rate": "0%", "is_system": True},
    {"code": "2200", "name": "VAT Output", "category": "liabilities", "subtype": "vat_control", "vat_rate": "20%", "is_system": True},
    {"code": "2210", "name": "VAT Input", "category": "assets", "subtype": "vat_control", "vat_rate": "20%", "is_system": True},
    {"code": "3000", "name": "Owner's Equity", "category": "equity", "subtype": "capital", "vat_rate": "0%", "is_system": True},
    {"code": "4000", "name": "Sales", "category": "income", "subtype": "sales", "vat_rate": "20%", "is_system": True},
    {"code": "5000", "name": "Office Expenses", "category": "expenses", "subtype": "operating", "vat_rate": "20%", "is_system": True},
]


def _normalize_category(category: str) -> str:
    normalized = category.strip().lower()
    if normalized not in ALLOWED_ACCOUNT_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid account category")
    return normalized


def _get_account(db: Session, *, company_id: str, account_id: str) -> Account:
    account = db.scalar(
        select(Account).where(
            Account.id == account_id,
            Account.company_id == company_id,
            Account.deleted_at.is_(None),
        )
    )
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return account


def seed_default_accounts(db: Session, *, company_id: str, actor_id: str) -> None:
    for default in DEFAULT_UK_ACCOUNTS:
        exists = db.scalar(
            select(Account).where(
                Account.company_id == company_id,
                Account.code == default["code"],
                Account.deleted_at.is_(None),
            )
        )
        if exists:
            continue

        db.add(
            Account(
                company_id=company_id,
                created_by=actor_id,
                updated_by=actor_id,
                code=default["code"],
                name=default["name"],
                category=default["category"],
                subtype=default["subtype"],
                vat_rate=default["vat_rate"],
                is_active=True,
                is_system=default["is_system"],
            )
        )


def create_account(db: Session, *, company_id: str, actor_id: str, payload: AccountCreate) -> Account:
    category = _normalize_category(payload.category)

    exists = db.scalar(
        select(Account).where(
            Account.company_id == company_id,
            Account.code == payload.code,
            Account.deleted_at.is_(None),
        )
    )
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account code already exists")

    account = Account(
        company_id=company_id,
        created_by=actor_id,
        updated_by=actor_id,
        code=payload.code.strip(),
        name=payload.name.strip(),
        category=category,
        subtype=payload.subtype.strip(),
        vat_rate=payload.vat_rate.strip(),
        is_active=True,
        is_system=False,
    )
    db.add(account)
    db.flush()

    log_audit_event(
        db,
        company_id=company_id,
        actor_id=actor_id,
        action="account.create",
        entity_type="account",
        entity_id=account.id,
        payload={"code": account.code, "category": account.category},
    )

    db.commit()
    db.refresh(account)
    return account


def update_account(
    db: Session,
    *,
    company_id: str,
    actor_id: str,
    account_id: str,
    payload: AccountUpdate,
) -> Account:
    account = _get_account(db, company_id=company_id, account_id=account_id)
    if account.is_system:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="System account cannot be edited")

    account.name = payload.name.strip()
    account.category = _normalize_category(payload.category)
    account.subtype = payload.subtype.strip()
    account.vat_rate = payload.vat_rate.strip()
    account.is_active = payload.is_active
    account.updated_by = actor_id

    log_audit_event(
        db,
        company_id=company_id,
        actor_id=actor_id,
        action="account.update",
        entity_type="account",
        entity_id=account.id,
        payload={"code": account.code, "category": account.category, "is_active": account.is_active},
    )

    db.commit()
    db.refresh(account)
    return account


def deactivate_account(db: Session, *, company_id: str, actor_id: str, account_id: str) -> Account:
    account = _get_account(db, company_id=company_id, account_id=account_id)
    if account.is_system:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="System account cannot be deactivated")

    account.is_active = False
    account.updated_by = actor_id

    log_audit_event(
        db,
        company_id=company_id,
        actor_id=actor_id,
        action="account.deactivate",
        entity_type="account",
        entity_id=account.id,
        payload={"code": account.code},
    )

    db.commit()
    db.refresh(account)
    return account


def list_accounts(db: Session, *, company_id: str) -> list[Account]:
    return list(
        db.scalars(
            select(Account)
            .where(Account.company_id == company_id, Account.deleted_at.is_(None))
            .order_by(Account.code.asc())
        )
    )
