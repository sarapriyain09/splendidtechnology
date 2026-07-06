from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TenantAuditMixin, UUIDMixin


class Company(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(255), index=True)


class User(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Membership(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "memberships"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    role: Mapped[str] = mapped_column(String(40), default="staff")


class RefreshToken(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "refresh_tokens"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    token_hash: Mapped[str] = mapped_column(String(255), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)


class Account(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "accounts"

    code: Mapped[str] = mapped_column(String(20), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[str] = mapped_column(String(50), index=True)
    subtype: Mapped[str] = mapped_column(String(80), default="")
    vat_rate: Mapped[str] = mapped_column(String(20), default="20%")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False)


class AuditEvent(UUIDMixin, TenantAuditMixin, Base):
    __tablename__ = "audit_events"

    action: Mapped[str] = mapped_column(String(80), index=True)
    entity_type: Mapped[str] = mapped_column(String(80), index=True)
    entity_id: Mapped[str] = mapped_column(String(64), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default={})
    note: Mapped[str] = mapped_column(Text, default="")
