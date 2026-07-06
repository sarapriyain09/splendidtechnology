import { useEffect, useMemo, useState } from "react";

import {
  type DiscoveryItem,
  type DiscoveryQuery,
  deleteSavedAnalysis,
  fetchDiscoveryProducts,
  fetchSavedAnalyses,
  fetchSavedDiscoveryRowKeys,
  saveProductAnalysesBulk,
  saveProductAnalysis,
} from "@/lib/api";

type SavedAnalysis = {
  id: number;
  source: string;
  product_name: string;
  market: string;
};

type QueryState = {
  keyword: string;
  category: string;
  min_price: string;
  max_price: string;
  market: string;
  sources: string[];
  page: number;
  page_size: number;
  sort_by: "reviews" | "price";
  sort_order: "asc" | "desc";
};

const STORAGE_KEY = "product-intelligence.discoveryQuery.v1";
const SOURCE_OPTIONS = ["amazon_public_api", "etsy_public_api", "alibaba_public_api"] as const;

const defaultQuery: QueryState = {
  keyword: "",
  category: "",
  min_price: "",
  max_price: "",
  market: "amazon_uk",
  sources: [],
  page: 1,
  page_size: 5,
  sort_by: "reviews",
  sort_order: "desc",
};

function readStoredQuery(): Partial<QueryState> {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<QueryState>;
  } catch {
    return {};
  }
}

function readUrlQuery(): Partial<QueryState> {
  const params = new URLSearchParams(window.location.search);
  if (Array.from(params.keys()).length === 0) {
    return {};
  }
  return {
    keyword: params.get("keyword") ?? "",
    category: params.get("category") ?? "",
    min_price: params.get("min_price") ?? "",
    max_price: params.get("max_price") ?? "",
    market: params.get("market") ?? "amazon_uk",
    sources: (params.get("sources") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    page: Number(params.get("page") ?? 1),
    page_size: Number(params.get("page_size") ?? 5),
    sort_by: (params.get("sort_by") as QueryState["sort_by"]) ?? "reviews",
    sort_order: (params.get("sort_order") as QueryState["sort_order"]) ?? "desc",
  };
}

function normalizeQuery(input: Partial<QueryState>): QueryState {
  return {
    ...defaultQuery,
    ...input,
    page: Number.isFinite(Number(input.page)) && Number(input.page) > 0 ? Number(input.page) : 1,
    page_size:
      Number.isFinite(Number(input.page_size)) && Number(input.page_size) > 0 ? Number(input.page_size) : defaultQuery.page_size,
    sort_by: input.sort_by === "price" ? "price" : "reviews",
    sort_order: input.sort_order === "asc" ? "asc" : "desc",
    sources: Array.isArray(input.sources)
      ? input.sources.filter((source): source is (typeof SOURCE_OPTIONS)[number] => SOURCE_OPTIONS.includes(source as any))
      : [],
    min_price: input.min_price ? String(input.min_price) : "",
    max_price: input.max_price ? String(input.max_price) : "",
  };
}

function toApiQuery(query: QueryState): DiscoveryQuery {
  return {
    keyword: query.keyword,
    category: query.category,
    min_price: query.min_price ? Number(query.min_price) : undefined,
    max_price: query.max_price ? Number(query.max_price) : undefined,
    market: query.market,
    sources: query.sources,
    page: query.page,
    page_size: query.page_size,
    sort_by: query.sort_by,
    sort_order: query.sort_order,
  };
}

function updateBrowserState(query: QueryState) {
  const params = new URLSearchParams();
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.category) params.set("category", query.category);
  if (query.min_price) params.set("min_price", query.min_price);
  if (query.max_price) params.set("max_price", query.max_price);
  if (query.market) params.set("market", query.market);
  if (query.sources.length > 0) params.set("sources", query.sources.join(","));
  params.set("page", String(query.page));
  params.set("page_size", String(query.page_size));
  params.set("sort_by", query.sort_by);
  params.set("sort_order", query.sort_order);

  const nextUrl = params.toString() ? `/?${params.toString()}` : "/";
  window.history.replaceState(null, "", nextUrl);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(query));
}

export function DiscoveryWorkbench() {
  const [query, setQuery] = useState<QueryState>(() => normalizeQuery({ ...readStoredQuery(), ...readUrlQuery() }));
  const [rows, setRows] = useState<DiscoveryItem[]>([]);
  const [savedRowKeys, setSavedRowKeys] = useState<Set<string>>(new Set());
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set());
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [savedFilter, setSavedFilter] = useState("");
  const [message, setMessage] = useState("");
  const [catalogText, setCatalogText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    updateBrowserState(query);
  }, [query]);

  useEffect(() => {
    void refreshSaved();
  }, []);

  const visibleUnsavedRows = useMemo(
    () => rows.filter((row) => !savedRowKeys.has(`${row.source}-${row.title}`)),
    [rows, savedRowKeys]
  );

  const selectedUnsavedRows = useMemo(
    () => visibleUnsavedRows.filter((row) => selectedRowKeys.has(`${row.source}-${row.title}`)),
    [visibleUnsavedRows, selectedRowKeys]
  );

  const filteredSaved = useMemo(() => {
    const normalized = savedFilter.trim().toLowerCase();
    if (!normalized) return savedAnalyses;
    return savedAnalyses.filter((item) => item.product_name.toLowerCase().includes(normalized));
  }, [savedAnalyses, savedFilter]);

  const [selectedSaved, setSelectedSaved] = useState<SavedAnalysis | null>(null);

  async function refreshSaved() {
    const [savedItems, savedKeys] = await Promise.all([fetchSavedAnalyses(), fetchSavedDiscoveryRowKeys()]);
    setSavedAnalyses(savedItems);
    setSavedRowKeys(savedKeys);
  }

  async function handleSearch() {
    const normalizedQuery: QueryState = { ...query, page: 1 };
    setQuery(normalizedQuery);
    const result = await fetchDiscoveryProducts(toApiQuery(normalizedQuery));
    setRows(result.items);
    setTotalCount(result.totalCount);
    setPage(result.page);
    const savedKeys = await fetchSavedDiscoveryRowKeys();
    setSavedRowKeys(savedKeys);
    setSelectedRowKeys(new Set());

    if (typeof result.catalogRowCount === "number" && typeof result.skippedRowCount === "number") {
      setCatalogText(`Catalog rows: ${result.catalogRowCount} | Skipped malformed rows: ${result.skippedRowCount}`);
    } else {
      setCatalogText("");
    }
  }

  function toggleSource(source: string) {
    setQuery((prev) => {
      const has = prev.sources.includes(source);
      return {
        ...prev,
        page: 1,
        sources: has ? prev.sources.filter((item) => item !== source) : [...prev.sources, source],
      };
    });
  }

  function updateField<K extends keyof QueryState>(key: K, value: QueryState[K]) {
    setQuery((prev) => ({ ...prev, page: 1, [key]: value }));
  }

  async function handleSaveRow(row: DiscoveryItem) {
    const result = await saveProductAnalysis({ ...row, market: query.market });
    const nextSavedKeys = new Set(savedRowKeys);
    nextSavedKeys.add(`${row.source}-${row.title}`);
    setSavedRowKeys(nextSavedKeys);
    setMessage(`Saved ${row.title} as record #${result.id}.`);
    await refreshSaved();
  }

  async function handleBulkSave() {
    const payload = selectedUnsavedRows.map((row) => ({ ...row, market: query.market }));
    const result = await saveProductAnalysesBulk(payload);
    const nextSavedKeys = new Set(savedRowKeys);
    for (const row of selectedUnsavedRows) {
      nextSavedKeys.add(`${row.source}-${row.title}`);
    }
    setSavedRowKeys(nextSavedKeys);
    setSelectedRowKeys(new Set());
    setMessage(`Bulk save complete: ${result.created_count} new, ${result.already_exists_count} existing.`);
    await refreshSaved();
  }

  function toggleRowSelection(row: DiscoveryItem) {
    const key = `${row.source}-${row.title}`;
    if (savedRowKeys.has(key)) return;
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function toggleSelectAllVisibleUnsaved(checked: boolean) {
    if (!checked) {
      setSelectedRowKeys(new Set());
      return;
    }
    setSelectedRowKeys(new Set(visibleUnsavedRows.map((row) => `${row.source}-${row.title}`)));
  }

  async function handleRemoveSaved(id: number) {
    const removed = await deleteSavedAnalysis(id);
    if (!removed) return;
    setMessage(`Removed saved record #${id}.`);
    setSelectedSaved((current) => (current?.id === id ? null : current));
    await refreshSaved();
  }

  return (
    <section>
      <h2>Discovery Workbench</h2>

      <div className="panel">
        <div className="grid">
          <input
            placeholder="Keyword"
            value={query.keyword}
            onChange={(event) => updateField("keyword", event.target.value)}
          />
          <input
            placeholder="Category (optional)"
            value={query.category}
            onChange={(event) => updateField("category", event.target.value)}
          />
          <input
            placeholder="Min price"
            type="number"
            value={query.min_price}
            onChange={(event) => updateField("min_price", event.target.value)}
          />
          <input
            placeholder="Max price"
            type="number"
            value={query.max_price}
            onChange={(event) => updateField("max_price", event.target.value)}
          />

          <select value={query.market} onChange={(event) => updateField("market", event.target.value)}>
            <option value="amazon_uk">amazon_uk</option>
            <option value="amazon_us">amazon_us</option>
            <option value="amazon_eu">amazon_eu</option>
          </select>

          <select
            aria-label="Results per page"
            value={String(query.page_size)}
            onChange={(event) => updateField("page_size", Number(event.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="row">
          {SOURCE_OPTIONS.map((source) => {
            const active = query.sources.includes(source);
            return (
              <button
                key={source}
                type="button"
                className={active ? "chip bg-slateDeep" : "chip bg-slate-100"}
                onClick={() => toggleSource(source)}
              >
                {source}
              </button>
            );
          })}
        </div>

        <div className="row">
          <button
            type="button"
            className={query.sort_by === "reviews" ? "chip bg-slateDeep" : "chip bg-slate-100"}
            onClick={() => updateField("sort_by", "reviews")}
          >
            Reviews High-Low
          </button>
          <button
            type="button"
            className={query.sort_by === "price" ? "chip bg-slateDeep" : "chip bg-slate-100"}
            onClick={() => {
              setQuery((prev) => ({ ...prev, page: 1, sort_by: "price", sort_order: "asc" }));
            }}
          >
            Price Low-High
          </button>

          <button type="button" onClick={handleSearch}>
            Search
          </button>

          <button type="button" disabled={selectedUnsavedRows.length === 0} onClick={handleBulkSave}>
            Save Selected ({selectedUnsavedRows.length})
          </button>
        </div>
      </div>

      {message ? <p>{message}</p> : null}
      {catalogText ? <p>{catalogText}</p> : null}
      <p>
        Total: {totalCount} | Page {page} of {Math.max(1, Math.ceil(totalCount / query.page_size))}
      </p>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                aria-label="Select all visible unsaved rows"
                checked={visibleUnsavedRows.length > 0 && selectedUnsavedRows.length === visibleUnsavedRows.length}
                onChange={(event) => toggleSelectAllVisibleUnsaved(event.currentTarget.checked)}
              />
            </th>
            <th>Title</th>
            <th>Source</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = `${row.source}-${row.title}`;
            const isSaved = savedRowKeys.has(rowKey);
            return (
              <tr key={rowKey}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${row.title}`}
                    checked={selectedRowKeys.has(rowKey)}
                    disabled={isSaved}
                    onChange={() => toggleRowSelection(row)}
                  />
                </td>
                <td>{row.title}</td>
                <td>{row.source}</td>
                <td>{row.price.toFixed(2)}</td>
                <td>
                  {isSaved ? (
                    <button type="button" disabled>
                      <span>Saved</span>
                    </button>
                  ) : (
                    <button type="button" onClick={() => handleSaveRow(row)}>
                      Save
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />

      <section>
        <h3>Saved Records</h3>
        <div className="row">
          <button type="button" onClick={() => void refreshSaved()}>
            Refresh Saved
          </button>
          <label>
            Filter saved records
            <input
              aria-label="Filter saved records"
              value={savedFilter}
              onChange={(event) => setSavedFilter(event.target.value)}
            />
          </label>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Source</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSaved.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product_name}</td>
                <td>{item.source}</td>
                <td>
                  <button type="button" onClick={() => setSelectedSaved(item)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedSaved ? (
          <aside>
            <h4>Saved Details</h4>
            <p>Product: {selectedSaved.product_name}</p>
            <p>Source: {selectedSaved.source}</p>
            <p>Market: {selectedSaved.market}</p>
            <button type="button" onClick={() => void handleRemoveSaved(selectedSaved.id)}>
              Remove #{selectedSaved.id}
            </button>
          </aside>
        ) : null}
      </section>
    </section>
  );
}
