from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
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


class ProductCategory(Base):
    __tablename__ = "product_categories"
    __table_args__ = (UniqueConstraint("tenant_id", "name", name="uq_product_category_tenant_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductCollection(Base):
    __tablename__ = "product_collections"
    __table_args__ = (UniqueConstraint("tenant_id", "name", name="uq_product_collection_tenant_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductCatalogItem(Base):
    __tablename__ = "product_catalog_items"
    __table_args__ = (UniqueConstraint("tenant_id", "sku", name="uq_product_catalog_tenant_sku"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="idea", nullable=False)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("product_categories.id"), nullable=True)
    collection_id: Mapped[int | None] = mapped_column(ForeignKey("product_collections.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductSupplierLink(Base):
    __tablename__ = "product_supplier_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("product_catalog_items.id"), nullable=False, index=True)
    supplier_name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    moq: Mapped[int | None] = mapped_column(Integer, nullable=True)
    lead_time_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    payment_terms: Mapped[str | None] = mapped_column(String(120), nullable=True)
    incoterms: Mapped[str | None] = mapped_column(String(80), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductMission(Base):
    __tablename__ = "product_missions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    mission_text: Mapped[str] = mapped_column(Text, nullable=False)
    quick_mission: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="draft", nullable=False)
    current_stage_index: Mapped[int] = mapped_column(Integer, default=-1, nullable=False)

    recommended_product_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    recommended_sku: Mapped[str | None] = mapped_column(String(80), nullable=True)
    opportunity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_product_id: Mapped[int | None] = mapped_column(ForeignKey("product_catalog_items.id"), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
