from collections import Counter
from typing import Any

from fastapi import APIRouter, Depends, Response
from sqlalchemy import tuple_
from sqlalchemy.orm import Session

from app.api.contracts_v1 import router as contracts_v1_router
from app.core.request_context import RequestContext, require_request_context
from app.db.models import ProductAnalysis, SavedDiscoveryRecord
from app.db.session import get_db
from app.schemas import (
    BulkSaveAnalysisItemResponse,
    BulkSaveAnalysisRequest,
    BulkSaveAnalysisResponse,
    CompetitionRequest,
    DeleteSavedAnalysisResponse,
    DiscoveryImportRequest,
    ManufacturingCostRequest,
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


@router.post("/discovery/search", response_model=list[ProductCandidate])
def discover_products(
    query: ProductDiscoveryQuery,
    response: Response,
    _ctx: RequestContext = Depends(require_request_context),
) -> list[ProductCandidate]:
    total_count = DiscoveryConnectorService.count_public_catalog_matches(query)
    results = DiscoveryConnectorService.search_public_catalog(query)

    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Page"] = str(query.page)
    response.headers["X-Page-Size"] = str(query.page_size)
    response.headers["X-Sort-By"] = query.sort_by
    response.headers["X-Sort-Order"] = query.sort_order

    return results


@router.post("/discovery/import", response_model=list[ProductCandidate])
def import_discovery_records(
    payload: DiscoveryImportRequest,
    _ctx: RequestContext = Depends(require_request_context),
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


@router.post("/database/save")
def save_analysis(
    payload: SaveAnalysisRequest,
    ctx: RequestContext = Depends(require_request_context),
    db: Session = Depends(get_db),
) -> SaveAnalysisResponse:
    result = _save_or_get_analysis(payload, tenant_id=ctx.tenant_id, db=db)
    db.commit()
    return result


@router.post("/database/save-bulk")
def save_analysis_bulk(
    payload: BulkSaveAnalysisRequest,
    ctx: RequestContext = Depends(require_request_context),
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
    ctx: RequestContext = Depends(require_request_context),
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


router.include_router(contracts_v1_router)
