"""initial accounting schema

Revision ID: 20260628_0001
Revises:
Create Date: 2026-06-28
"""

from alembic import op
import sqlalchemy as sa


revision = "20260628_0001"
down_revision = None
branch_labels = None
depends_on = None


def _audit_columns(nullable_company_id: bool = False) -> list[sa.Column]:
    return [
        sa.Column("company_id", sa.String(), nullable=nullable_company_id),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_by", sa.String(), nullable=False, server_default="system"),
        sa.Column("updated_by", sa.String(), nullable=False, server_default="system"),
    ]


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        *_audit_columns(nullable_company_id=True),
    )
    op.create_index("ix_companies_company_id", "companies", ["company_id"])
    op.create_index("ix_companies_name", "companies", ["name"])

    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        *_audit_columns(),
    )
    op.create_index("ix_users_company_id", "users", ["company_id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "memberships",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(length=40), nullable=False, server_default="staff"),
        *_audit_columns(),
    )
    op.create_index("ix_memberships_company_id", "memberships", ["company_id"])
    op.create_index("ix_memberships_user_id", "memberships", ["user_id"])

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        *_audit_columns(),
    )
    op.create_index("ix_refresh_tokens_company_id", "refresh_tokens", ["company_id"])
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"])
    op.create_index("ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"])

    op.create_table(
        "accounts",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("subtype", sa.String(length=80), nullable=False, server_default=""),
        sa.Column("vat_rate", sa.String(length=20), nullable=False, server_default="20%"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_system", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        *_audit_columns(),
    )
    op.create_index("ix_accounts_category", "accounts", ["category"])
    op.create_index("ix_accounts_code", "accounts", ["code"])
    op.create_index("ix_accounts_company_id", "accounts", ["company_id"])
    op.create_index("ix_accounts_name", "accounts", ["name"])

    op.create_table(
        "audit_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("action", sa.String(length=80), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("note", sa.Text(), nullable=False, server_default=""),
        *_audit_columns(),
    )
    op.create_index("ix_audit_events_action", "audit_events", ["action"])
    op.create_index("ix_audit_events_company_id", "audit_events", ["company_id"])
    op.create_index("ix_audit_events_entity_id", "audit_events", ["entity_id"])
    op.create_index("ix_audit_events_entity_type", "audit_events", ["entity_type"])


def downgrade() -> None:
    op.drop_table("audit_events")
    op.drop_table("accounts")
    op.drop_table("refresh_tokens")
    op.drop_table("memberships")
    op.drop_table("users")
    op.drop_table("companies")
