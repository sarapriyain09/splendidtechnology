export type DiscoveryItem = {
  source: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  brand: string | null;
  dimensions: string | null;
  weight_kg: number | null;
};

export type DiscoveryQuery = {
  keyword: string;
  category: string;
  min_price?: number;
  max_price?: number;
  market: string;
  sources: string[];
  page: number;
  page_size: number;
  sort_by: "reviews" | "price";
  sort_order: "asc" | "desc";
};

type SavedAnalysis = {
  id: number;
  source: string;
  product_name: string;
  market: string;
};

type BulkResultItem = SavedAnalysis & {
  created: boolean;
  already_exists: boolean;
};

const SAVED_ANALYSES_KEY = "product-intelligence.savedAnalyses.v1";
const NEXT_ID_KEY = "product-intelligence.savedAnalyses.nextId.v1";

const DISCOVERY_ITEMS: DiscoveryItem[] = [
  {
    source: "amazon_public_api",
    title: "Laptop Stand Alpha",
    price: 24.99,
    rating: 4.5,
    reviews: 120,
    brand: "BrandA",
    dimensions: null,
    weight_kg: null,
  },
  {
    source: "etsy_public_api",
    title: "Desk Shelf Beta",
    price: 31.5,
    rating: 4.7,
    reviews: 84,
    brand: "BrandB",
    dimensions: null,
    weight_kg: null,
  },
  {
    source: "alibaba_public_api",
    title: "Monitor Riser Gamma",
    price: 18.25,
    rating: 4.2,
    reviews: 203,
    brand: "BrandC",
    dimensions: null,
    weight_kg: null,
  },
];

function readSavedAnalyses(): SavedAnalysis[] {
  const raw = window.localStorage.getItem(SAVED_ANALYSES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as SavedAnalysis[];
  } catch {
    return [];
  }
}

function writeSavedAnalyses(items: SavedAnalysis[]) {
  window.localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(items));
}

function nextId() {
  const currentRaw = window.localStorage.getItem(NEXT_ID_KEY);
  const current = currentRaw ? Number(currentRaw) : 1;
  const safeCurrent = Number.isFinite(current) && current > 0 ? current : 1;
  window.localStorage.setItem(NEXT_ID_KEY, String(safeCurrent + 1));
  return safeCurrent;
}

export async function fetchDiscoveryProducts(query: DiscoveryQuery): Promise<{
  items: DiscoveryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  catalogRowCount?: number;
  skippedRowCount?: number;
}> {
  const normalizedKeyword = query.keyword.trim().toLowerCase();
  const normalizedCategory = query.category.trim().toLowerCase();

  let items = [...DISCOVERY_ITEMS];
  if (query.sources.length > 0) {
    items = items.filter((item) => query.sources.includes(item.source));
  }
  if (normalizedKeyword) {
    items = items.filter((item) => item.title.toLowerCase().includes(normalizedKeyword));
  }
  if (normalizedCategory) {
    items = items.filter((item) => item.title.toLowerCase().includes(normalizedCategory));
  }
  if (typeof query.min_price === "number") {
    items = items.filter((item) => item.price >= query.min_price!);
  }
  if (typeof query.max_price === "number") {
    items = items.filter((item) => item.price <= query.max_price!);
  }

  if (query.sort_by === "price") {
    items.sort((a, b) => (query.sort_order === "asc" ? a.price - b.price : b.price - a.price));
  } else {
    items.sort((a, b) => (query.sort_order === "asc" ? a.reviews - b.reviews : b.reviews - a.reviews));
  }

  return {
    items,
    totalCount: items.length,
    page: query.page,
    pageSize: query.page_size,
    sortBy: query.sort_by,
    sortOrder: query.sort_order,
  };
}

export async function fetchSavedDiscoveryRowKeys(): Promise<Set<string>> {
  const keys = readSavedAnalyses().map((item) => `${item.source}-${item.product_name}`);
  return new Set(keys);
}

export async function saveProductAnalysis(item: DiscoveryItem & { market: string }): Promise<{ id: number; created: boolean; already_exists: boolean }> {
  const existing = readSavedAnalyses().find(
    (row) => row.source === item.source && row.product_name === item.title && row.market === item.market
  );
  if (existing) {
    return { id: existing.id, created: false, already_exists: true };
  }

  const created: SavedAnalysis = {
    id: nextId(),
    source: item.source,
    product_name: item.title,
    market: item.market,
  };
  const all = [...readSavedAnalyses(), created];
  writeSavedAnalyses(all);
  return { id: created.id, created: true, already_exists: false };
}

export async function saveProductAnalysesBulk(
  items: Array<DiscoveryItem & { market: string }>
): Promise<{ total: number; created_count: number; already_exists_count: number; items: BulkResultItem[] }> {
  const results: BulkResultItem[] = [];
  let createdCount = 0;
  let existingCount = 0;

  for (const item of items) {
    const saved = await saveProductAnalysis(item);
    if (saved.created) {
      createdCount += 1;
    } else {
      existingCount += 1;
    }
    results.push({
      id: saved.id,
      source: item.source,
      product_name: item.title,
      market: item.market,
      created: saved.created,
      already_exists: saved.already_exists,
    });
  }

  return {
    total: items.length,
    created_count: createdCount,
    already_exists_count: existingCount,
    items: results,
  };
}

export async function fetchSavedAnalyses(): Promise<SavedAnalysis[]> {
  return readSavedAnalyses().sort((a, b) => b.id - a.id);
}

export async function deleteSavedAnalysis(id: number): Promise<boolean> {
  const before = readSavedAnalyses();
  const after = before.filter((item) => item.id !== id);
  writeSavedAnalyses(after);
  return after.length < before.length;
}
