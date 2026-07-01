"""create saved discovery records table

Revision ID: 20260701_0001
Revises:
Create Date: 2026-07-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260701_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "saved_discovery_records",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("tenant_id", sa.String(length=100), nullable=False),
        sa.Column("source", sa.String(length=100), nullable=False),
        sa.Column("product_name", sa.String(length=255), nullable=False),
        sa.Column("market", sa.String(length=50), nullable=False),
        sa.Column("source_normalized", sa.String(length=100), nullable=False),
        sa.Column("product_name_normalized", sa.String(length=255), nullable=False),
        sa.Column("market_normalized", sa.String(length=50), nullable=False),
        sa.Column("analysis_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "tenant_id",
            "source_normalized",
            "product_name_normalized",
            "market_normalized",
            name="uq_saved_discovery_tenant_source_product_market_norm",
        ),
    )
    op.create_index(op.f("ix_saved_discovery_records_id"), "saved_discovery_records", ["id"], unique=False)
    op.create_index(op.f("ix_saved_discovery_records_tenant_id"), "saved_discovery_records", ["tenant_id"], unique=False)
    op.create_index(op.f("ix_saved_discovery_records_source_normalized"), "saved_discovery_records", ["source_normalized"], unique=False)
    op.create_index(
        op.f("ix_saved_discovery_records_product_name_normalized"),
        "saved_discovery_records",
        ["product_name_normalized"],
        unique=False,
    )
    op.create_index(op.f("ix_saved_discovery_records_market_normalized"), "saved_discovery_records", ["market_normalized"], unique=False)
    op.create_index(op.f("ix_saved_discovery_records_analysis_id"), "saved_discovery_records", ["analysis_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_saved_discovery_records_analysis_id"), table_name="saved_discovery_records")
    op.drop_index(op.f("ix_saved_discovery_records_market_normalized"), table_name="saved_discovery_records")
    op.drop_index(op.f("ix_saved_discovery_records_product_name_normalized"), table_name="saved_discovery_records")
    op.drop_index(op.f("ix_saved_discovery_records_source_normalized"), table_name="saved_discovery_records")
    op.drop_index(op.f("ix_saved_discovery_records_tenant_id"), table_name="saved_discovery_records")
    op.drop_index(op.f("ix_saved_discovery_records_id"), table_name="saved_discovery_records")
    op.drop_table("saved_discovery_records")
