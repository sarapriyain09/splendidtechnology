export type DashboardOverview = {
  products_analysed: number;
  top_opportunities: number;
  avg_profit_estimate: number;
  avg_competition: number;
  avg_product_score: number;
  b2b_opportunities: number;
};

export type ProductCandidate = {
  source: string;
  title: string;
  image_url?: string | null;
  price: number;
  rating: number;
  reviews: number;
  brand: string | null;
  category?: string | null;
  marketplace?: string | null;
  country?: string | null;
  material?: string | null;
  dimensions: string | null;
  weight_kg: number | null;
};

export type DiscoverySearchQuery = {
  product_name?: string;
  keyword: string;
  category?: string;
  brand?: string;
  marketplace?: string;
  country?: string;
  material?: string;
  min_price: number;
  max_price: number;
  selling_price_min?: number;
  selling_price_max?: number;
  min_rating?: number;
  max_rating?: number;
  min_reviews?: number;
  max_reviews?: number;
  max_weight_kg?: number;
  max_dimensions?: string;
  flat_pack?: boolean;
  assembly_required?: boolean;
  suitable_b2b?: boolean;
  suitable_amazon?: boolean;
  suitable_website?: boolean;
  market: string;
  sources: string[];
  page: number;
  page_size: number;
  sort_by: "title" | "price" | "rating" | "reviews";
  sort_order: "asc" | "desc";
};

export type DiscoverySearchResult = {
  items: ProductCandidate[];
  totalCount: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  catalogRowCount?: number;
  skippedRowCount?: number;
};

export type SaveAnalysisRequest = {
  product_name: string;
  source: string;
  market: string;
  opportunity_score: number;
  estimated_profit_percent: number;
  competition_score: number;
};

export type SaveAnalysisResponse = {
  id: number;
  created: boolean;
  already_exists: boolean;
};

export type BulkSaveAnalysisItem = {
  id: number;
  source: string;
  product_name: string;
  market: string;
  created: boolean;
  already_exists: boolean;
};

export type BulkSaveAnalysisResponse = {
  total: number;
  created_count: number;
  already_exists_count: number;
  items: BulkSaveAnalysisItem[];
};

export type SavedDiscoveryLookupItem = {
  source: string;
  title: string;
  market: string;
};

export type SavedAnalysisItem = {
  id: number;
  product_name: string;
  source: string;
  market: string;
  opportunity_score: number;
  estimated_profit_percent: number;
  competition_score: number;
};

export type ReviewAnalysisRequest = {
  product_name: string;
  one_star: string[];
  two_star: string[];
  three_star: string[];
};

export type ReviewPainPoint = {
  term?: string;
  mentions?: number;
  pain_point?: string;
  count?: number;
};

export type ReviewAnalysisResponse = {
  top_pain_points: Array<ReviewPainPoint | string>;
};

export type CompetitionAnalysisRequest = {
  number_of_sellers: number;
  average_reviews: number;
  average_rating: number;
  price_std_deviation: number;
  brand_dominance: number;
};

export type CompetitionAnalysisResponse = {
  competition_score: number;
};

export type ManufacturingCostEstimateRequest = {
  product_name: string;
  target_market: string;
  selling_price: number;
  country: string;
  material_cost: number;
  labour_cost: number;
  packaging_cost: number;
  shipping_cost: number;
  import_duty_cost: number;
  amazon_fee_cost: number;
  storage_cost: number;
  advertising_cost: number;
};

export type ManufacturingCostEstimateResponse = {
  product_name: string;
  country: string;
  target_market: string;
  total_cost: number;
  estimated_profit: number;
  profit_percent: number;
};

export type OpportunitySuggestionRequest = {
  product_name: string;
  pain_points: string[];
};

export type B2BSuggestionResponse = {
  potential_markets: string[];
};

export type ManufacturingRecommendationResponse = {
  materials: string[];
  cnc_optimizations: string[];
};

export type OpportunityConcept = {
  name: string;
  improvement: string;
};

export type OpportunityConceptsResponse = {
  concepts: OpportunityConcept[];
};

export type ProductFamilyResponse = {
  product_family: string[];
};

export type ProductCategory = {
  id: number;
  name: string;
  description?: string | null;
};

export type ProductCollection = {
  id: number;
  name: string;
  description?: string | null;
};

export type ProductCatalogItem = {
  id: number;
  name: string;
  sku: string;
  status: string;
  category_id?: number | null;
  collection_id?: number | null;
};

export type ProductSupplierLink = {
  id: number;
  product_id: number;
  supplier_name: string;
  country?: string | null;
  moq?: number | null;
  lead_time_days?: number | null;
  payment_terms?: string | null;
  incoterms?: string | null;
};

export type MissionStatus = "draft" | "running" | "pending_approval" | "approved" | "rejected" | "failed";

export type ProductMission = {
  id: number;
  mission_text: string;
  quick_mission?: string | null;
  status: MissionStatus;
  current_stage_index: number;
  recommended_product_name?: string | null;
  recommended_sku?: string | null;
  opportunity_score?: number | null;
  created_product_id?: number | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8011/api/v1";
const API_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "20000");

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildContextHeaders(): HeadersInit {
  return {
    "X-Tenant-Id": process.env.NEXT_PUBLIC_TENANT_ID ?? "tenant-demo",
    "X-User-Id": process.env.NEXT_PUBLIC_USER_ID ?? "user-demo",
    "X-User-Role": process.env.NEXT_PUBLIC_USER_ROLE ?? "owner",
    "X-Request-Source": process.env.NEXT_PUBLIC_REQUEST_SOURCE ?? "product-intelligence-frontend",
  };
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/dashboard/overview`, {
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard overview");
  }

  return response.json() as Promise<DashboardOverview>;
}

export async function fetchDiscoveryProducts(query: DiscoverySearchQuery): Promise<DiscoverySearchResult> {
  const payload = {
    keyword: query.keyword,
    category: query.category,
    min_price: query.min_price,
    max_price: query.max_price,
    market: query.market,
    sources: query.sources,
    page: query.page,
    page_size: query.page_size,
    sort_by: query.sort_by,
    sort_order: query.sort_order,
  };

  const response = await fetchWithTimeout(`${API_BASE_URL}/discovery/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load discovery products");
  }

  const items = (await response.json()) as ProductCandidate[];
  return {
    items,
    totalCount: Number(response.headers.get("X-Total-Count") ?? items.length),
    page: Number(response.headers.get("X-Page") ?? query.page),
    pageSize: Number(response.headers.get("X-Page-Size") ?? query.page_size),
    sortBy: response.headers.get("X-Sort-By") ?? query.sort_by,
    sortOrder: response.headers.get("X-Sort-Order") ?? query.sort_order,
    catalogRowCount: Number(response.headers.get("X-Catalog-Row-Count") ?? "0"),
    skippedRowCount: Number(response.headers.get("X-Skipped-Row-Count") ?? "0"),
  };
}

export async function saveProductAnalysis(payload: SaveAnalysisRequest): Promise<SaveAnalysisResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/database/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to save product analysis");
  }

  return response.json() as Promise<SaveAnalysisResponse>;
}

export async function saveProductAnalysesBulk(payloads: SaveAnalysisRequest[]): Promise<BulkSaveAnalysisResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/database/save-bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify({ items: payloads }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to bulk save product analyses");
  }

  return response.json() as Promise<BulkSaveAnalysisResponse>;
}

export async function fetchSavedDiscoveryRowKeys(items: SavedDiscoveryLookupItem[]): Promise<Set<string>> {
  if (items.length === 0) {
    return new Set<string>();
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}/database/saved-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify({ items }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load saved discovery status");
  }

  const payload = (await response.json()) as { saved_row_keys: string[] };
  return new Set<string>(payload.saved_row_keys ?? []);
}

export async function fetchSavedAnalyses(): Promise<SavedAnalysisItem[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/database/saved`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load saved analyses");
  }

  const payload = (await response.json()) as { items: SavedAnalysisItem[] };
  return payload.items ?? [];
}

export async function deleteSavedAnalysis(analysisId: number): Promise<boolean> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/database/saved/${analysisId}`, {
    method: "DELETE",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to delete saved analysis");
  }

  const payload = (await response.json()) as { deleted: boolean };
  return payload.deleted;
}

export async function analyzeReviewPainPoints(payload: ReviewAnalysisRequest): Promise<ReviewAnalysisResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/reviews/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to analyze review pain points");
  }

  return response.json() as Promise<ReviewAnalysisResponse>;
}

export async function analyzeCompetition(payload: CompetitionAnalysisRequest): Promise<CompetitionAnalysisResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/competition/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to analyze competition");
  }

  return response.json() as Promise<CompetitionAnalysisResponse>;
}

export async function estimateManufacturingCost(
  payload: ManufacturingCostEstimateRequest,
): Promise<ManufacturingCostEstimateResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/cost/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to estimate cost");
  }

  return response.json() as Promise<ManufacturingCostEstimateResponse>;
}

export async function suggestB2BMarkets(payload: OpportunitySuggestionRequest): Promise<B2BSuggestionResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/b2b/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to suggest B2B markets");
  }

  return response.json() as Promise<B2BSuggestionResponse>;
}

export async function fetchManufacturingRecommendations(
  payload: OpportunitySuggestionRequest,
): Promise<ManufacturingRecommendationResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/drawings/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load manufacturing recommendations");
  }

  return response.json() as Promise<ManufacturingRecommendationResponse>;
}

export async function generateOpportunityConcepts(
  payload: OpportunitySuggestionRequest,
): Promise<OpportunityConceptsResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/opportunity/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to generate opportunity concepts");
  }

  return response.json() as Promise<OpportunityConceptsResponse>;
}

export async function generateProductFamily(
  payload: OpportunitySuggestionRequest,
): Promise<ProductFamilyResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/family/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to generate product family");
  }

  return response.json() as Promise<ProductFamilyResponse>;
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/categories`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load product categories");
  }

  return response.json() as Promise<ProductCategory[]>;
}

export async function createProductCategory(payload: {
  name: string;
  description?: string;
}): Promise<ProductCategory> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create product category");
  }

  return response.json() as Promise<ProductCategory>;
}

export async function fetchProductCollections(): Promise<ProductCollection[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/collections`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load product collections");
  }

  return response.json() as Promise<ProductCollection[]>;
}

export async function createProductCollection(payload: {
  name: string;
  description?: string;
}): Promise<ProductCollection> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create product collection");
  }

  return response.json() as Promise<ProductCollection>;
}

export async function fetchProducts(): Promise<ProductCatalogItem[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json() as Promise<ProductCatalogItem[]>;
}

export async function createProduct(payload: {
  name: string;
  sku: string;
  status?: string;
  category_id?: number | null;
  collection_id?: number | null;
}): Promise<ProductCatalogItem> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json() as Promise<ProductCatalogItem>;
}

export async function fetchProductSupplierLinks(productId: number): Promise<ProductSupplierLink[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/${productId}/suppliers`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load product suppliers");
  }

  return response.json() as Promise<ProductSupplierLink[]>;
}

export async function createProductSupplierLink(
  productId: number,
  payload: {
    supplier_name: string;
    country?: string;
    moq?: number;
    lead_time_days?: number;
    payment_terms?: string;
    incoterms?: string;
  },
): Promise<ProductSupplierLink> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/products/${productId}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create product supplier link");
  }

  return response.json() as Promise<ProductSupplierLink>;
}

export async function fetchMissions(): Promise<ProductMission[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/missions`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load missions");
  }

  const payload = (await response.json()) as { items: ProductMission[] };
  return payload.items ?? [];
}

export async function createMission(payload: { mission_text: string; quick_mission?: string | null }): Promise<ProductMission> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/missions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create mission");
  }

  return response.json() as Promise<ProductMission>;
}

export async function fetchMission(missionId: number): Promise<ProductMission> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/missions/${missionId}`, {
    method: "GET",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load mission status");
  }

  return response.json() as Promise<ProductMission>;
}

export async function runMission(missionId: number): Promise<ProductMission> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/missions/${missionId}/run`, {
    method: "POST",
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to run mission");
  }

  return response.json() as Promise<ProductMission>;
}

export async function approveMission(
  missionId: number,
  payload?: { product_name?: string; sku?: string; status?: string },
): Promise<ProductMission> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/missions/${missionId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(payload ?? {}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to approve mission");
  }

  return response.json() as Promise<ProductMission>;
}
