from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ProductAnalysis(Base):
    __tablename__ = "product_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    market: Mapped[str] = mapped_column(String(50), nullable=False)
    opportunity_score: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_profit_percent: Mapped[float] = mapped_column(Float, nullable=False)
    competition_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class SavedDiscoveryRecord(Base):
    __tablename__ = "saved_discovery_records"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "source_normalized",
            "product_name_normalized",
            "market_normalized",
            name="uq_saved_discovery_tenant_source_product_market_norm",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    market: Mapped[str] = mapped_column(String(50), nullable=False)
    source_normalized: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    product_name_normalized: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    market_normalized: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    analysis_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
