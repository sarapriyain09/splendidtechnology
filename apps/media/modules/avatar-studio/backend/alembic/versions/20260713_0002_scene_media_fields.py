"""add scene media fields

Revision ID: 20260713_0002
Revises: 20260628_0001
Create Date: 2026-07-13
"""

from alembic import op
import sqlalchemy as sa


revision = "20260713_0002"
down_revision = "20260628_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("scenes", sa.Column("image_url", sa.Text(), nullable=False, server_default=""))
    op.add_column("scenes", sa.Column("voice_audio_url", sa.Text(), nullable=False, server_default=""))
    op.add_column("scenes", sa.Column("music", sa.String(length=50), nullable=False, server_default="none"))


def downgrade() -> None:
    op.drop_column("scenes", "music")
    op.drop_column("scenes", "voice_audio_url")
    op.drop_column("scenes", "image_url")
