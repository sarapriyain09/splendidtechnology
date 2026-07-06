from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.core.request_context import RequestContext, require_request_context
from app.schemas_v1 import (
    BusinessQuestionCard,
    CashAvailabilityResponse,
    ControlPlaneOverviewResponse,
    DispatchTodayResponse,
    InventorySummaryResponse,
    MarketingProfitabilityResponse,
    ProductsSummaryResponse,
    SupportSummaryResponse,
)

router = APIRouter(prefix="/contracts/v1", tags=["contracts-v1"])


@router.get("/health")
def contracts_health(_ctx: RequestContext = Depends(require_request_context)) -> dict[str, str]:
    return {
        "status": "ok",
        "contract": "commerce-v1",
        "version": "2026-07-05",
    }


@router.get("/products/summary", response_model=ProductsSummaryResponse)
def products_summary(_ctx: RequestContext = Depends(require_request_context)) -> ProductsSummaryResponse:
    return ProductsSummaryResponse(
        total_products=0,
        ready_products=0,
        active_products=0,
        top_categories=[],
    )


@router.get("/inventory/summary", response_model=InventorySummaryResponse)
def inventory_summary(_ctx: RequestContext = Depends(require_request_context)) -> InventorySummaryResponse:
    return InventorySummaryResponse(
        low_stock_skus=0,
        total_available_units=0,
        stockout_risk_skus=0,
        next_reorder_date=None,
    )


@router.get("/orders/dispatch-today", response_model=DispatchTodayResponse)
def dispatch_today(_ctx: RequestContext = Depends(require_request_context)) -> DispatchTodayResponse:
    return DispatchTodayResponse(due_today=0, overdue=0, blocked=0)


@router.get("/cashflow/availability", response_model=CashAvailabilityResponse)
def cashflow_availability(_ctx: RequestContext = Depends(require_request_context)) -> CashAvailabilityResponse:
    return CashAvailabilityResponse(
        currency="GBP",
        available_now=0,
        expected_7d=0,
        expected_30d=0,
        warning_level="ok",
    )


@router.get("/support/summary", response_model=SupportSummaryResponse)
def support_summary(_ctx: RequestContext = Depends(require_request_context)) -> SupportSummaryResponse:
    return SupportSummaryResponse(open_cases=0, overdue_cases=0, top_issue_categories=[])


@router.get("/marketing/profitability", response_model=MarketingProfitabilityResponse)
def marketing_profitability(_ctx: RequestContext = Depends(require_request_context)) -> MarketingProfitabilityResponse:
    return MarketingProfitabilityResponse(
        profitable_campaigns=0,
        unprofitable_campaigns=0,
        avg_acos=0,
        avg_roas=0,
    )


@router.get("/control-plane/overview", response_model=ControlPlaneOverviewResponse)
def control_plane_overview(_ctx: RequestContext = Depends(require_request_context)) -> ControlPlaneOverviewResponse:
    now = datetime.now(timezone.utc)
    cards = [
        BusinessQuestionCard(
            module="products",
            question="What am I selling?",
            answered_at=now,
            primary_value="0 active products",
            secondary_value="0 ready for Amazon",
            status="warning",
        ),
        BusinessQuestionCard(
            module="inventory",
            question="What stock do I have?",
            answered_at=now,
            primary_value="0 available units",
            secondary_value="0 low-stock SKUs",
            status="ok",
        ),
        BusinessQuestionCard(
            module="orders",
            question="What must I dispatch today?",
            answered_at=now,
            primary_value="0 due today",
            secondary_value="0 overdue",
            status="ok",
        ),
        BusinessQuestionCard(
            module="cash_flow",
            question="How much money is available?",
            answered_at=now,
            primary_value="GBP 0.00",
            secondary_value="7d projection GBP 0.00",
            status="warning",
        ),
    ]

    return ControlPlaneOverviewResponse(generated_at=now, cards=cards)
