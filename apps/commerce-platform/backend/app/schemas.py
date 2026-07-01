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


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginUser(BaseModel):
    id: str
    company_id: str
    full_name: str
    email: str
    role: str


class LoginTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    tokens: LoginTokens
    user: LoginUser


class ProductCandidate(BaseModel):
    source: str
    title: str
    image_url: str | None = None
    price: float
    rating: float
    reviews: int
    brand: str | None = None
    dimensions: str | None = None
    weight_kg: float | None = None


class DiscoveryImportItem(BaseModel):
    source: str = Field(description="Data source identifier (user_upload, amazon_public_api, etc.)")
    title: str
    image_url: str | None = None
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


class BulkSaveAnalysisRequest(BaseModel):
    items: list[SaveAnalysisRequest] = Field(default_factory=list)


class BulkSaveAnalysisItemResponse(BaseModel):
    id: int
    source: str
    product_name: str
    market: str
    created: bool
    already_exists: bool


class BulkSaveAnalysisResponse(BaseModel):
    total: int
    created_count: int
    already_exists_count: int
    items: list[BulkSaveAnalysisItemResponse] = Field(default_factory=list)


class SavedDiscoveryLookupItem(BaseModel):
    source: str
    title: str
    market: str


class SavedDiscoveryLookupRequest(BaseModel):
    items: list[SavedDiscoveryLookupItem] = Field(default_factory=list)


class SavedDiscoveryLookupResponse(BaseModel):
    saved_row_keys: list[str] = Field(default_factory=list)


class SavedAnalysisItemResponse(BaseModel):
    id: int
    product_name: str
    source: str
    market: str
    opportunity_score: float
    estimated_profit_percent: float
    competition_score: float


class SavedAnalysisListResponse(BaseModel):
    items: list[SavedAnalysisItemResponse] = Field(default_factory=list)


class DeleteSavedAnalysisResponse(BaseModel):
    deleted: bool


class ProductCategoryCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None


class ProductCategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None = None


class ProductCollectionCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None


class ProductCollectionResponse(BaseModel):
    id: int
    name: str
    description: str | None = None


class ProductCatalogCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=80)
    status: str = Field(default="idea", min_length=1, max_length=50)
    category_id: int | None = None
    collection_id: int | None = None


class ProductCatalogResponse(BaseModel):
    id: int
    name: str
    sku: str
    status: str
    category_id: int | None = None
    collection_id: int | None = None


class ProductSupplierLinkCreateRequest(BaseModel):
    supplier_name: str = Field(min_length=1, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    moq: int | None = Field(default=None, ge=0)
    lead_time_days: int | None = Field(default=None, ge=0)
    payment_terms: str | None = Field(default=None, max_length=120)
    incoterms: str | None = Field(default=None, max_length=80)


class ProductSupplierLinkResponse(BaseModel):
    id: int
    product_id: int
    supplier_name: str
    country: str | None = None
    moq: int | None = None
    lead_time_days: int | None = None
    payment_terms: str | None = None
    incoterms: str | None = None


class MissionCreateRequest(BaseModel):
    mission_text: str = Field(min_length=1, max_length=5000)
    quick_mission: str | None = Field(default=None, max_length=255)


class MissionRunResponse(BaseModel):
    id: int
    mission_text: str
    quick_mission: str | None = None
    status: str
    current_stage_index: int
    recommended_product_name: str | None = None
    recommended_sku: str | None = None
    opportunity_score: float | None = None
    created_product_id: int | None = None


class MissionListResponse(BaseModel):
    items: list[MissionRunResponse] = Field(default_factory=list)


class MissionApproveRequest(BaseModel):
    product_name: str | None = Field(default=None, min_length=1, max_length=255)
    sku: str | None = Field(default=None, min_length=1, max_length=80)
    status: str = Field(default="idea", min_length=1, max_length=50)
