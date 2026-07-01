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
  price: number;
  rating: number;
  reviews: number;
  brand: string | null;
  dimensions: string | null;
  weight_kg: number | null;
};

export type DiscoverySearchQuery = {
  keyword: string;
  category?: string;
  min_price: number;
  max_price: number;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8011/api/v1";

function buildContextHeaders(): HeadersInit {
  return {
    "X-Tenant-Id": process.env.NEXT_PUBLIC_TENANT_ID ?? "tenant-demo",
    "X-User-Id": process.env.NEXT_PUBLIC_USER_ID ?? "user-demo",
    "X-User-Role": process.env.NEXT_PUBLIC_USER_ROLE ?? "owner",
    "X-Request-Source": process.env.NEXT_PUBLIC_REQUEST_SOURCE ?? "product-intelligence-frontend",
  };
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
    headers: buildContextHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard overview");
  }

  return response.json() as Promise<DashboardOverview>;
}

export async function fetchDiscoveryProducts(query: DiscoverySearchQuery): Promise<DiscoverySearchResult> {
  const response = await fetch(`${API_BASE_URL}/discovery/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildContextHeaders(),
    },
    body: JSON.stringify(query),
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
  };
}

export async function saveProductAnalysis(payload: SaveAnalysisRequest): Promise<SaveAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/database/save`, {
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
  const response = await fetch(`${API_BASE_URL}/database/save-bulk`, {
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

  const response = await fetch(`${API_BASE_URL}/database/saved-status`, {
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
  const response = await fetch(`${API_BASE_URL}/database/saved`, {
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
  const response = await fetch(`${API_BASE_URL}/database/saved/${analysisId}`, {
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
