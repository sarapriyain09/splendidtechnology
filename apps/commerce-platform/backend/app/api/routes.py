from collections import Counter
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Response
from sqlalchemy import tuple_
from sqlalchemy.orm import Session

from app.core.request_context import RequestContext, require_request_context
from app.core.request_context import require_roles
from app.core.security import create_access_token
from app.db.models import (
    ProductAnalysis,
    ProductCatalogItem,
    ProductCategory,
    ProductCollection,
    ProductMission,
    ProductSupplierLink,
    SavedDiscoveryRecord,
)
from app.db.session import get_db
from app.schemas import (
    BulkSaveAnalysisItemResponse,
    BulkSaveAnalysisRequest,
    BulkSaveAnalysisResponse,
    CompetitionRequest,
    DeleteSavedAnalysisResponse,
    DiscoveryImportRequest,
    ProductCatalogCreateRequest,
    ProductCatalogResponse,
    ProductCategoryCreateRequest,
    ProductCategoryResponse,
    ProductCollectionCreateRequest,
    ProductCollectionResponse,
    ProductSupplierLinkCreateRequest,
    ProductSupplierLinkResponse,
    ManufacturingCostRequest,
    MissionApproveRequest,
    MissionCreateRequest,
    MissionListResponse,
    MissionRunResponse,
    LoginRequest,
    LoginResponse,
    LoginTokens,
    LoginUser,
    OpportunityRequest,
    ProductCandidate,
    ProductDiscoveryQuery,
    ProductScoreRequest,
    ReviewAnalysisRequest,
    SaveAnalysisRequest,
    SaveAnalysisResponse,
    SavedAnalysisItemResponse,
    SavedAnalysisListResponse,
    SavedDiscoveryLookupRequest,
    SavedDiscoveryLookupResponse,
)
from app.services.agent_platform_client import AgentPlatformClient
from app.services.discovery_connectors import DiscoveryConnectorService

router = APIRouter()

MISSION_STAGES = [
    "Product Discovery Agent",
    "Market Agent",
    "Review Agent",
    "Pricing Agent",
    "Manufacturing Agent",
    "Decision Agent",
]
MISSION_STAGE_DURATION_SECONDS = 1.2


DEMO_USERS = {
    "owner@velynxia.local": {
        "id": "user-owner-1",
        "company_id": "tenant-1",
        "full_name": "Velynxia Owner",
        "email": "owner@velynxia.local",
        "role": "owner",
        "password": "StrongPass123!",
    },
    "analyst@velynxia.local": {
        "id": "user-analyst-1",
        "company_id": "tenant-1",
        "full_name": "Velynxia Analyst",
        "email": "analyst@velynxia.local",
        "role": "analyst",
        "password": "StrongPass123!",
    },
}


def _normalize_key_part(value: str) -> str:
    return value.strip().lower()


def _save_or_get_analysis(
    payload: SaveAnalysisRequest,
    *,
    tenant_id: str,
    db: Session,
) -> SaveAnalysisResponse:
    source_normalized = _normalize_key_part(payload.source)
    product_name_normalized = _normalize_key_part(payload.product_name)
    market_normalized = _normalize_key_part(payload.market)

    existing = (
        db.query(SavedDiscoveryRecord)
        .filter(
            SavedDiscoveryRecord.tenant_id == tenant_id,
            SavedDiscoveryRecord.source_normalized == source_normalized,
            SavedDiscoveryRecord.product_name_normalized == product_name_normalized,
            SavedDiscoveryRecord.market_normalized == market_normalized,
        )
        .first()
    )

    if existing:
        return SaveAnalysisResponse(id=existing.analysis_id, created=False, already_exists=True)

    entry = ProductAnalysis(
        product_name=payload.product_name,
        market=payload.market,
        opportunity_score=payload.opportunity_score,
        estimated_profit_percent=payload.estimated_profit_percent,
        competition_score=payload.competition_score,
    )
    db.add(entry)
    db.flush()

    db.add(
        SavedDiscoveryRecord(
            tenant_id=tenant_id,
            source=payload.source,
            product_name=payload.product_name,
            market=payload.market,
            source_normalized=source_normalized,
            product_name_normalized=product_name_normalized,
            market_normalized=market_normalized,
            analysis_id=entry.id,
        )
    )

    return SaveAnalysisResponse(id=entry.id, created=True, already_exists=False)


def _agent_result_or_empty(payload: dict[str, Any]) -> dict[str, Any]:
    result = payload.get("result")
    if isinstance(result, dict):
        return result
    return {}


def _mission_response(row: ProductMission) -> MissionRunResponse:
    return MissionRunResponse(
        id=row.id,
        mission_text=row.mission_text,
        quick_mission=row.quick_mission,
        status=row.status,
        current_stage_index=row.current_stage_index,
        recommended_product_name=row.recommended_product_name,
        recommended_sku=row.recommended_sku,
        opportunity_score=row.opportunity_score,
        created_product_id=row.created_product_id,
    )


def _derive_recommendation(row: ProductMission) -> None:
    text = row.quick_mission or row.mission_text
    name_source = " ".join(text.strip().split())[:80]
    product_name = name_source if name_source else f"Mission Product {row.id}"
    safe_id = str(row.id).zfill(4)

    row.recommended_product_name = product_name
    row.recommended_sku = f"VPL-{safe_id}"
    row.opportunity_score = 82.0


def _refresh_mission_state(row: ProductMission) -> bool:
    if row.status != "running" or not row.started_at:
        return False

    now = datetime.now(timezone.utc)
    elapsed_seconds = max((now - row.started_at).total_seconds(), 0.0)
    stage_count = len(MISSION_STAGES)
    stage_index = min(int(elapsed_seconds / MISSION_STAGE_DURATION_SECONDS), stage_count - 1)
    changed = False

    if row.current_stage_index != stage_index:
        row.current_stage_index = stage_index
        changed = True

    if elapsed_seconds >= stage_count * MISSION_STAGE_DURATION_SECONDS:
        row.status = "pending_approval"
        row.current_stage_index = stage_count - 1
        row.completed_at = row.completed_at or now
        if not row.recommended_product_name or not row.recommended_sku or row.opportunity_score is None:
            _derive_recommendation(row)
        changed = True

    return changed


def _local_review_pain_points(payload: ReviewAnalysisRequest) -> list[dict[str, int]]:
    corpus = payload.one_star + payload.two_star + payload.three_star
    normalized = [line.lower().strip() for line in corpus if line.strip()]
    tokenized = [sentence.split() for sentence in normalized]

    important_terms: list[str] = []
    for words in tokenized:
        important_terms.extend(word for word in words if len(word) > 4)

    top_terms = Counter(important_terms).most_common(20)
    return [{"term": term, "mentions": count} for term, count in top_terms]


def _local_opportunity_concepts(product_name: str) -> list[dict[str, str]]:
    return [
        {
            "name": f"{product_name} Pro",
            "improvement": "Use higher grade material and reinforced joinery for better durability.",
        },
        {
            "name": f"{product_name} Smart",
            "improvement": "Add modular accessories and integrated cable/power management.",
        },
        {
            "name": f"{product_name} Family Kit",
            "improvement": "Create a flat-pack range with shared components for cross-sell bundles.",
        },
    ]


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    email = payload.email.strip().lower()
    user = DEMO_USERS.get(email)
    if not user or payload.password != user["password"]:
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        user_id=user["id"],
        tenant_id=user["company_id"],
        role=user["role"],
    )

    return LoginResponse(
        tokens=LoginTokens(
            access_token=access_token,
            refresh_token=access_token,
            token_type="bearer",
        ),
        user=LoginUser(
            id=user["id"],
            company_id=user["company_id"],
            full_name=user["full_name"],
            email=user["email"],
            role=user["role"],
        ),
    )


@router.post("/discovery/search", response_model=list[ProductCandidate])
def discover_products(
    query: ProductDiscoveryQuery,
    response: Response,
    _ctx: RequestContext = Depends(require_request_context),
) -> list[ProductCandidate]:
    results, metrics = DiscoveryConnectorService.search_public_catalog_with_metrics(query)

    response.headers["X-Total-Count"] = str(metrics["total_matches"])
    response.headers["X-Page"] = str(query.page)
    response.headers["X-Page-Size"] = str(query.page_size)
    response.headers["X-Sort-By"] = query.sort_by
    response.headers["X-Sort-Order"] = query.sort_order
    response.headers["X-Catalog-Row-Count"] = str(metrics["catalog_row_count"])
    response.headers["X-Skipped-Row-Count"] = str(metrics["skipped_row_count"])

    return results


@router.post("/discovery/import", response_model=list[ProductCandidate])
def import_discovery_records(
    payload: DiscoveryImportRequest,
    _ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
) -> list[ProductCandidate]:
    return DiscoveryConnectorService.import_user_records(payload.items)


@router.post("/reviews/analyze")
async def analyze_reviews(
    payload: ReviewAnalysisRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, list[dict[str, Any]]]:
    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.review-pain-points.v1",
        payload={
            "product_name": payload.product_name,
            "one_star": payload.one_star,
            "two_star": payload.two_star,
            "three_star": payload.three_star,
            "expected_output": "top_20_pain_points",
        },
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    pain_points = result.get("top_pain_points")
    if isinstance(pain_points, list):
        return {"top_pain_points": pain_points[:20]}

    return {"top_pain_points": _local_review_pain_points(payload)}


@router.post("/opportunity/generate")
async def generate_opportunities(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, list[dict[str, str]]]:
    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.opportunity-concepts.v1",
        payload={
            "product_name": payload.product_name,
            "pain_points": payload.pain_points,
            "concept_count": 3,
        },
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    concepts = result.get("concepts")
    if isinstance(concepts, list) and concepts:
        return {"concepts": concepts[:3]}

    return {"concepts": _local_opportunity_concepts(payload.product_name)}


@router.post("/cost/estimate")
def estimate_cost(
    payload: ManufacturingCostRequest,
    _ctx: RequestContext = Depends(require_request_context),
) -> dict[str, float | str]:
    total_cost = (
        payload.material_cost
        + payload.labour_cost
        + payload.packaging_cost
        + payload.shipping_cost
        + payload.import_duty_cost
        + payload.amazon_fee_cost
        + payload.storage_cost
        + payload.advertising_cost
    )
    estimated_profit = payload.selling_price - total_cost
    profit_percent = 0.0 if payload.selling_price <= 0 else (estimated_profit / payload.selling_price) * 100

    return {
        "product_name": payload.product_name,
        "country": payload.country,
        "target_market": payload.target_market,
        "total_cost": round(total_cost, 2),
        "estimated_profit": round(estimated_profit, 2),
        "profit_percent": round(profit_percent, 2),
    }


@router.post("/competition/analyze")
def analyze_competition(
    payload: CompetitionRequest,
    _ctx: RequestContext = Depends(require_request_context),
) -> dict[str, float]:
    seller_factor = min(payload.number_of_sellers / 150, 1) * 100
    review_factor = min(payload.average_reviews / 5000, 1) * 100
    rating_factor = (payload.average_rating / 5) * 100
    volatility_factor = min(payload.price_std_deviation / 25, 1) * 100

    competition_score = (
        (seller_factor * 0.30)
        + (review_factor * 0.25)
        + (rating_factor * 0.20)
        + (payload.brand_dominance * 0.15)
        + (volatility_factor * 0.10)
    )

    return {"competition_score": round(competition_score, 2)}


@router.post("/scoring/score")
def score_product(
    payload: ProductScoreRequest,
    _ctx: RequestContext = Depends(require_request_context),
) -> dict[str, float]:
    # Higher return risk and manufacturing complexity reduce opportunity.
    adjusted_return = 100 - payload.return_risk
    adjusted_complexity = 100 - payload.manufacturing_complexity

    score = (
        payload.demand * 0.25
        + payload.competition * 0.20
        + payload.profit_margin * 0.20
        + adjusted_return * 0.10
        + adjusted_complexity * 0.10
        + payload.b2b_potential * 0.10
        + payload.innovation_opportunity * 0.05
    )

    return {"opportunity_score": round(score, 2)}


@router.post("/b2b/suggest")
async def suggest_b2b(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, list[str]]:
    default_markets = [
        "Hotels",
        "Schools",
        "Universities",
        "Hospitals",
        "Restaurants",
        "Offices",
        "Factories",
        "Warehouses",
        "Retail Shops",
    ]

    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.b2b-fit.v1",
        payload={
            "product_name": payload.product_name,
            "pain_points": payload.pain_points,
            "industries": default_markets,
        },
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    markets = result.get("potential_markets")
    if isinstance(markets, list) and markets:
        return {"potential_markets": markets}

    return {"potential_markets": default_markets}


@router.post("/family/generate")
async def generate_family(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, list[str]]:
    base = payload.product_name
    default_family = [
        base,
        f"{base} Lite",
        f"{base} Pro",
        f"{base} Desk Organizer",
        f"{base} Cable Box",
        f"{base} Stand",
        f"{base} Accessory Kit",
    ]

    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.family-roadmap.v1",
        payload={"product_name": payload.product_name, "pain_points": payload.pain_points},
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    family = result.get("product_family")
    if isinstance(family, list) and family:
        return {"product_family": family}

    return {"product_family": default_family}


@router.post("/drawings/recommend")
async def drawing_recommendations(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, list[str]]:
    default_materials = ["MDF", "Plywood", "Bamboo", "Steel", "Plastic"]
    default_cnc = [
        "Reduce tool changes via grouped operations",
        "Use standard board widths to minimize waste",
        "Design tabs and slots for fast assembly",
    ]

    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.drawings-cnc.v1",
        payload={"product_name": payload.product_name, "pain_points": payload.pain_points},
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    materials = result.get("materials")
    optimizations = result.get("cnc_optimizations")

    return {
        "materials": materials if isinstance(materials, list) and materials else default_materials,
        "cnc_optimizations": optimizations if isinstance(optimizations, list) and optimizations else default_cnc,
    }


@router.post("/marketing/generate")
async def generate_marketing(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, str]:
    product = payload.product_name
    default_content = {
        "amazon_title": f"{product} - Premium Space Saving Design for Home and Office",
        "bullet_points": "Strong build, modern look, easy assembly, optimized for FBA.",
        "description": f"{product} is engineered for durability and premium everyday use.",
        "keywords": f"{product.lower()}, premium, office, home",
        "linkedin_post": f"Introducing the next generation of {product} designed for scale.",
        "website_content": f"Discover how {product} improves usability and profitability.",
    }

    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.marketing-content.v1",
        payload={"product_name": payload.product_name, "pain_points": payload.pain_points},
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    if result:
        merged = {**default_content, **{k: v for k, v in result.items() if isinstance(v, str)}}
        return merged

    return default_content


@router.post("/packaging/suggest")
async def packaging_suggestion(
    payload: OpportunityRequest,
    ctx: RequestContext = Depends(require_request_context),
) -> dict[str, str]:
    default_packaging = {
        "fba_packaging": "Kraft double-wall carton with corner protection and barcode-safe area",
        "flat_pack": "Two-piece knockdown configuration with hardware pouch",
        "drop_test": "Pass ISTA 3A equivalent drop points",
        "recommended_box_size": "48 x 32 x 10 cm",
        "estimated_weight": "2.6 kg",
    }

    client = AgentPlatformClient()
    response = await client.run_product_intelligence_prompt(
        prompt_key="product-intelligence.packaging-fba.v1",
        payload={"product_name": payload.product_name, "pain_points": payload.pain_points},
        context=ctx,
    )

    result = _agent_result_or_empty(response)
    if result:
        merged = {**default_packaging, **{k: v for k, v in result.items() if isinstance(v, str)}}
        return merged

    return default_packaging


@router.get("/dashboard/overview")
def dashboard_overview(
    _ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> dict[str, float | int]:
    rows = db.query(ProductAnalysis).all()
    if not rows:
        return {
            "products_analysed": 0,
            "top_opportunities": 0,
            "avg_profit_estimate": 0,
            "avg_competition": 0,
            "avg_product_score": 0,
            "b2b_opportunities": 0,
        }

    products_analysed = len(rows)
    top_opportunities = sum(1 for row in rows if row.opportunity_score >= 75)
    b2b_opportunities = sum(1 for row in rows if row.opportunity_score >= 70 and row.competition_score <= 60)

    return {
        "products_analysed": products_analysed,
        "top_opportunities": top_opportunities,
        "avg_profit_estimate": round(sum(row.estimated_profit_percent for row in rows) / products_analysed, 2),
        "avg_competition": round(sum(row.competition_score for row in rows) / products_analysed, 2),
        "avg_product_score": round(sum(row.opportunity_score for row in rows) / products_analysed, 2),
        "b2b_opportunities": b2b_opportunities,
    }


@router.get("/missions", response_model=MissionListResponse)
def list_missions(
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> MissionListResponse:
    rows = (
        db.query(ProductMission)
        .filter(ProductMission.tenant_id == ctx.tenant_id)
        .order_by(ProductMission.created_at.desc())
        .limit(20)
        .all()
    )

    changed = any(_refresh_mission_state(row) for row in rows)
    if changed:
        db.commit()
        for row in rows:
            db.refresh(row)

    return MissionListResponse(items=[_mission_response(row) for row in rows])


@router.post("/missions", response_model=MissionRunResponse)
def create_mission(
    payload: MissionCreateRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> MissionRunResponse:
    row = ProductMission(
        tenant_id=ctx.tenant_id,
        mission_text=payload.mission_text.strip(),
        quick_mission=payload.quick_mission.strip() if payload.quick_mission else None,
        status="draft",
        current_stage_index=-1,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _mission_response(row)


@router.get("/missions/{mission_id}", response_model=MissionRunResponse)
def get_mission(
    mission_id: int,
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> MissionRunResponse:
    row = (
        db.query(ProductMission)
        .filter(ProductMission.tenant_id == ctx.tenant_id, ProductMission.id == mission_id)
        .first()
    )
    if not row:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Mission not found")

    if _refresh_mission_state(row):
        db.commit()
        db.refresh(row)

    return _mission_response(row)


@router.post("/missions/{mission_id}/run", response_model=MissionRunResponse)
def run_mission(
    mission_id: int,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> MissionRunResponse:
    row = (
        db.query(ProductMission)
        .filter(ProductMission.tenant_id == ctx.tenant_id, ProductMission.id == mission_id)
        .first()
    )
    if not row:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Mission not found")

    if row.status not in {"draft", "rejected", "failed"}:
        from fastapi import HTTPException

        raise HTTPException(status_code=409, detail="Mission is not in a runnable state")

    row.status = "running"
    row.started_at = datetime.now(timezone.utc)
    row.completed_at = None
    row.approved_at = None
    row.current_stage_index = 0
    row.created_product_id = None
    row.recommended_product_name = None
    row.recommended_sku = None
    row.opportunity_score = None

    db.commit()
    db.refresh(row)
    return _mission_response(row)


@router.post("/missions/{mission_id}/approve", response_model=MissionRunResponse)
def approve_mission(
    mission_id: int,
    payload: MissionApproveRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "admin")),
    db: Session = Depends(get_db),
) -> MissionRunResponse:
    row = (
        db.query(ProductMission)
        .filter(ProductMission.tenant_id == ctx.tenant_id, ProductMission.id == mission_id)
        .first()
    )
    if not row:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Mission not found")

    if _refresh_mission_state(row):
        db.flush()

    if row.status not in {"pending_approval", "approved"}:
        from fastapi import HTTPException

        raise HTTPException(status_code=409, detail="Mission is not awaiting approval")

    if row.created_product_id is None:
        product_name = (payload.product_name or row.recommended_product_name or f"Mission Product {row.id}").strip()
        sku = (payload.sku or row.recommended_sku or f"VPL-{str(row.id).zfill(4)}").strip()

        product = ProductCatalogItem(
            tenant_id=ctx.tenant_id,
            name=product_name,
            sku=sku,
            status=payload.status.strip().lower(),
        )
        db.add(product)
        db.flush()
        row.created_product_id = product.id
        row.recommended_product_name = product_name
        row.recommended_sku = sku

    row.status = "approved"
    row.approved_at = row.approved_at or datetime.now(timezone.utc)

    db.commit()
    db.refresh(row)
    return _mission_response(row)


@router.post("/database/save")
def save_analysis(
    payload: SaveAnalysisRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> SaveAnalysisResponse:
    result = _save_or_get_analysis(payload, tenant_id=ctx.tenant_id, db=db)
    db.commit()
    return result


@router.post("/database/save-bulk")
def save_analysis_bulk(
    payload: BulkSaveAnalysisRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> BulkSaveAnalysisResponse:
    if not payload.items:
        return BulkSaveAnalysisResponse(total=0, created_count=0, already_exists_count=0, items=[])

    item_results: list[BulkSaveAnalysisItemResponse] = []
    for item in payload.items:
        result = _save_or_get_analysis(item, tenant_id=ctx.tenant_id, db=db)
        item_results.append(
            BulkSaveAnalysisItemResponse(
                id=result.id,
                source=item.source,
                product_name=item.product_name,
                market=item.market,
                created=result.created,
                already_exists=result.already_exists,
            )
        )

    db.commit()

    created_count = sum(1 for item in item_results if item.created)
    already_exists_count = sum(1 for item in item_results if item.already_exists)

    return BulkSaveAnalysisResponse(
        total=len(item_results),
        created_count=created_count,
        already_exists_count=already_exists_count,
        items=item_results,
    )


@router.post("/database/saved-status")
def saved_discovery_status(
    payload: SavedDiscoveryLookupRequest,
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> SavedDiscoveryLookupResponse:
    if not payload.items:
        return SavedDiscoveryLookupResponse(saved_row_keys=[])

    normalized_keys = {
        (
            _normalize_key_part(item.source),
            _normalize_key_part(item.title),
            _normalize_key_part(item.market),
        )
        for item in payload.items
    }
    normalized_to_original_row_key = {
        (
            _normalize_key_part(item.source),
            _normalize_key_part(item.title),
            _normalize_key_part(item.market),
        ): f"{item.source}-{item.title}"
        for item in payload.items
    }

    saved_records = (
        db.query(SavedDiscoveryRecord)
        .filter(
            SavedDiscoveryRecord.tenant_id == ctx.tenant_id,
            tuple_(
                SavedDiscoveryRecord.source_normalized,
                SavedDiscoveryRecord.product_name_normalized,
                SavedDiscoveryRecord.market_normalized,
            ).in_(normalized_keys),
        )
        .all()
    )

    saved_row_keys: list[str] = []
    for record in saved_records:
        row_key = normalized_to_original_row_key.get(
            (
                record.source_normalized,
                record.product_name_normalized,
                record.market_normalized,
            )
        )
        if row_key:
            saved_row_keys.append(row_key)

    return SavedDiscoveryLookupResponse(saved_row_keys=saved_row_keys)


@router.get("/database/saved")
def list_saved_analyses(
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> SavedAnalysisListResponse:
    rows = (
        db.query(SavedDiscoveryRecord, ProductAnalysis)
        .join(ProductAnalysis, ProductAnalysis.id == SavedDiscoveryRecord.analysis_id)
        .filter(SavedDiscoveryRecord.tenant_id == ctx.tenant_id)
        .order_by(SavedDiscoveryRecord.created_at.desc())
        .all()
    )

    items = [
        SavedAnalysisItemResponse(
            id=analysis.id,
            product_name=saved.product_name,
            source=saved.source,
            market=saved.market,
            opportunity_score=analysis.opportunity_score,
            estimated_profit_percent=analysis.estimated_profit_percent,
            competition_score=analysis.competition_score,
        )
        for saved, analysis in rows
    ]

    return SavedAnalysisListResponse(items=items)


@router.delete("/database/saved/{analysis_id}")
def delete_saved_analysis(
    analysis_id: int,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "admin")),
    db: Session = Depends(get_db),
) -> DeleteSavedAnalysisResponse:
    saved_record = (
        db.query(SavedDiscoveryRecord)
        .filter(
            SavedDiscoveryRecord.tenant_id == ctx.tenant_id,
            SavedDiscoveryRecord.analysis_id == analysis_id,
        )
        .first()
    )

    if not saved_record:
        return DeleteSavedAnalysisResponse(deleted=False)

    db.delete(saved_record)
    analysis = db.query(ProductAnalysis).filter(ProductAnalysis.id == analysis_id).first()
    if analysis:
        db.delete(analysis)

    db.commit()
    return DeleteSavedAnalysisResponse(deleted=True)


@router.get("/products/categories", response_model=list[ProductCategoryResponse])
def list_product_categories(
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> list[ProductCategoryResponse]:
    rows = (
        db.query(ProductCategory)
        .filter(ProductCategory.tenant_id == ctx.tenant_id)
        .order_by(ProductCategory.name.asc())
        .all()
    )
    return [ProductCategoryResponse(id=row.id, name=row.name, description=row.description) for row in rows]


@router.post("/products/categories", response_model=ProductCategoryResponse)
def create_product_category(
    payload: ProductCategoryCreateRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> ProductCategoryResponse:
    category = ProductCategory(
        tenant_id=ctx.tenant_id,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return ProductCategoryResponse(id=category.id, name=category.name, description=category.description)


@router.get("/products/collections", response_model=list[ProductCollectionResponse])
def list_product_collections(
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> list[ProductCollectionResponse]:
    rows = (
        db.query(ProductCollection)
        .filter(ProductCollection.tenant_id == ctx.tenant_id)
        .order_by(ProductCollection.name.asc())
        .all()
    )
    return [ProductCollectionResponse(id=row.id, name=row.name, description=row.description) for row in rows]


@router.post("/products/collections", response_model=ProductCollectionResponse)
def create_product_collection(
    payload: ProductCollectionCreateRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> ProductCollectionResponse:
    collection = ProductCollection(
        tenant_id=ctx.tenant_id,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)
    return ProductCollectionResponse(id=collection.id, name=collection.name, description=collection.description)


@router.get("/products", response_model=list[ProductCatalogResponse])
def list_products(
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> list[ProductCatalogResponse]:
    rows = (
        db.query(ProductCatalogItem)
        .filter(ProductCatalogItem.tenant_id == ctx.tenant_id)
        .order_by(ProductCatalogItem.created_at.desc())
        .all()
    )
    return [
        ProductCatalogResponse(
            id=row.id,
            name=row.name,
            sku=row.sku,
            status=row.status,
            category_id=row.category_id,
            collection_id=row.collection_id,
        )
        for row in rows
    ]


@router.post("/products", response_model=ProductCatalogResponse)
def create_product(
    payload: ProductCatalogCreateRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> ProductCatalogResponse:
    row = ProductCatalogItem(
        tenant_id=ctx.tenant_id,
        name=payload.name.strip(),
        sku=payload.sku.strip(),
        status=payload.status.strip().lower(),
        category_id=payload.category_id,
        collection_id=payload.collection_id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ProductCatalogResponse(
        id=row.id,
        name=row.name,
        sku=row.sku,
        status=row.status,
        category_id=row.category_id,
        collection_id=row.collection_id,
    )


@router.get("/products/{product_id}/suppliers", response_model=list[ProductSupplierLinkResponse])
def list_product_suppliers(
    product_id: int,
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> list[ProductSupplierLinkResponse]:
    rows = (
        db.query(ProductSupplierLink)
        .filter(
            ProductSupplierLink.tenant_id == ctx.tenant_id,
            ProductSupplierLink.product_id == product_id,
        )
        .order_by(ProductSupplierLink.created_at.desc())
        .all()
    )
    return [
        ProductSupplierLinkResponse(
            id=row.id,
            product_id=row.product_id,
            supplier_name=row.supplier_name,
            country=row.country,
            moq=row.moq,
            lead_time_days=row.lead_time_days,
            payment_terms=row.payment_terms,
            incoterms=row.incoterms,
        )
        for row in rows
    ]


@router.post("/products/{product_id}/suppliers", response_model=ProductSupplierLinkResponse)
def create_product_supplier_link(
    product_id: int,
    payload: ProductSupplierLinkCreateRequest,
    ctx: RequestContext = Depends(require_roles("owner", "manager", "analyst", "admin")),
    db: Session = Depends(get_db),
) -> ProductSupplierLinkResponse:
    product = (
        db.query(ProductCatalogItem)
        .filter(ProductCatalogItem.tenant_id == ctx.tenant_id, ProductCatalogItem.id == product_id)
        .first()
    )
    if not product:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Product not found")

    row = ProductSupplierLink(
        tenant_id=ctx.tenant_id,
        product_id=product_id,
        supplier_name=payload.supplier_name.strip(),
        country=payload.country.strip() if payload.country else None,
        moq=payload.moq,
        lead_time_days=payload.lead_time_days,
        payment_terms=payload.payment_terms.strip() if payload.payment_terms else None,
        incoterms=payload.incoterms.strip() if payload.incoterms else None,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return ProductSupplierLinkResponse(
        id=row.id,
        product_id=row.product_id,
        supplier_name=row.supplier_name,
        country=row.country,
        moq=row.moq,
        lead_time_days=row.lead_time_days,
        payment_terms=row.payment_terms,
        incoterms=row.incoterms,
    )
