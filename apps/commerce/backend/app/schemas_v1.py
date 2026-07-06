from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

ModuleKey = Literal[
    "products",
    "suppliers",
    "inventory",
    "sales_channels",
    "orders",
    "delivery",
    "cash_flow",
    "customer_support",
    "marketing",
]


class BusinessQuestionCard(BaseModel):
    module: ModuleKey
    question: str
    answered_at: datetime
    primary_value: str
    secondary_value: str | None = None
    status: Literal["ok", "warning", "critical"] = "ok"


class ProductsSummaryResponse(BaseModel):
    question: str = "What am I selling?"
    total_products: int = Field(ge=0)
    ready_products: int = Field(ge=0)
    active_products: int = Field(ge=0)
    top_categories: list[str] = Field(default_factory=list)


class InventorySummaryResponse(BaseModel):
    question: str = "What stock do I have?"
    low_stock_skus: int = Field(ge=0)
    total_available_units: int = Field(ge=0)
    stockout_risk_skus: int = Field(ge=0)
    next_reorder_date: str | None = None


class DispatchTodayResponse(BaseModel):
    question: str = "What must I dispatch today?"
    due_today: int = Field(ge=0)
    overdue: int = Field(ge=0)
    blocked: int = Field(ge=0)


class CashAvailabilityResponse(BaseModel):
    question: str = "How much money is available?"
    currency: str = "GBP"
    available_now: float
    expected_7d: float
    expected_30d: float
    warning_level: Literal["ok", "watch", "critical"] = "ok"


class SupportSummaryResponse(BaseModel):
    question: str = "What problems are customers reporting?"
    open_cases: int = Field(ge=0)
    overdue_cases: int = Field(ge=0)
    top_issue_categories: list[str] = Field(default_factory=list)


class MarketingProfitabilityResponse(BaseModel):
    question: str = "Which Amazon campaigns are profitable?"
    profitable_campaigns: int = Field(ge=0)
    unprofitable_campaigns: int = Field(ge=0)
    avg_acos: float = Field(ge=0)
    avg_roas: float = Field(ge=0)


class ControlPlaneOverviewResponse(BaseModel):
    generated_at: datetime
    cards: list[BusinessQuestionCard] = Field(default_factory=list)
