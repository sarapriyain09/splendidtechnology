from typing import Literal

from pydantic import BaseModel, Field


class ProductDiscoveryQuery(BaseModel):
    keyword: str
    category: str | None = None
    min_price: float = 0
    max_price: float = 10000
    market: str = Field(default="amazon_uk")
    sources: list[str] = Field(default_factory=list)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    sort_by: Literal["title", "price", "rating", "reviews"] = "reviews"
    sort_order: Literal["asc", "desc"] = "desc"


class ProductCandidate(BaseModel):
    source: str
    title: str
    price: float
    rating: float
    reviews: int
    brand: str | None = None
    dimensions: str | None = None
    weight_kg: float | None = None


class DiscoveryImportItem(BaseModel):
    source: str = Field(description="Data source identifier (user_upload, amazon_public_api, etc.)")
    title: str
    price: float = Field(ge=0)
    rating: float = Field(ge=0, le=5)
    reviews: int = Field(ge=0)
    brand: str | None = None
    dimensions: str | None = None
    weight_kg: float | None = Field(default=None, ge=0)


class DiscoveryImportRequest(BaseModel):
    items: list[DiscoveryImportItem] = Field(default_factory=list)


class ReviewAnalysisRequest(BaseModel):
    product_name: str
    one_star: list[str] = Field(default_factory=list)
    two_star: list[str] = Field(default_factory=list)
    three_star: list[str] = Field(default_factory=list)


class OpportunityRequest(BaseModel):
    product_name: str
    pain_points: list[str]


class ManufacturingCostRequest(BaseModel):
    product_name: str
    target_market: str
    selling_price: float
    country: str
    material_cost: float
    labour_cost: float
    packaging_cost: float
    shipping_cost: float
    import_duty_cost: float
    amazon_fee_cost: float
    storage_cost: float
    advertising_cost: float


class CompetitionRequest(BaseModel):
    number_of_sellers: int
    average_reviews: float
    average_rating: float
    price_std_deviation: float
    brand_dominance: float = Field(ge=0, le=100)


class ProductScoreRequest(BaseModel):
    demand: float = Field(ge=0, le=100)
    competition: float = Field(ge=0, le=100)
    profit_margin: float = Field(ge=0, le=100)
    return_risk: float = Field(ge=0, le=100)
    manufacturing_complexity: float = Field(ge=0, le=100)
    b2b_potential: float = Field(ge=0, le=100)
    innovation_opportunity: float = Field(ge=0, le=100)


class SaveAnalysisRequest(BaseModel):
    product_name: str
    source: str = "unknown"
    market: str
    opportunity_score: float
    estimated_profit_percent: float
    competition_score: float


class SaveAnalysisResponse(BaseModel):
    id: int
    created: bool
    already_exists: bool


class SavedDiscoveryLookupItem(BaseModel):
    source: str
    title: str
    market: str


class SavedDiscoveryLookupRequest(BaseModel):
    items: list[SavedDiscoveryLookupItem] = Field(default_factory=list)


class SavedDiscoveryLookupResponse(BaseModel):
    saved_row_keys: list[str] = Field(default_factory=list)
