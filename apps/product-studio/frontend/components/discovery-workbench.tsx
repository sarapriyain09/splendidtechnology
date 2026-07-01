"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  DiscoverySearchQuery,
  DiscoverySearchResult,
  ProductCandidate,
  SavedAnalysisItem,
  deleteSavedAnalysis,
  fetchDiscoveryProducts,
  fetchSavedAnalyses,
  fetchSavedDiscoveryRowKeys,
  saveProductAnalysesBulk,
  saveProductAnalysis,
} from "@/lib/api";

const MARKET_OPTIONS = ["amazon_uk", "amazon_eu", "amazon_us", "b2b"];
const SOURCE_OPTIONS = ["amazon_public_api", "etsy_public_api", "alibaba_public_api"];
const MARKETPLACE_OPTIONS = ["Amazon", "Website", "B2B", "Shopify", "Etsy"];
const COUNTRY_OPTIONS = ["UK", "DE", "US", "IN", "CN"];
const STATUS_OPTIONS = ["Idea", "Research", "Shortlisted", "Prototype", "Supplier", "Manufacturing", "Launch", "Rejected"];
const SAVE_FOLDER_OPTIONS = ["Office", "Home", "Industrial", "Education", "Smart Products", "Custom"];
const PAGE_SIZE_OPTIONS = [5, 10, 20];
const DISCOVERY_QUERY_STORAGE_KEY = "product-intelligence.discoveryQuery.v1";

const DEFAULT_QUERY: DiscoverySearchQuery = {
  product_name: "",
  keyword: "stand",
  category: "",
  brand: "",
  marketplace: "Amazon",
  country: "UK",
  material: "",
  min_price: 0,
  max_price: 100,
  selling_price_min: 0,
  selling_price_max: 100,
  min_rating: 0,
  max_rating: 5,
  min_reviews: 0,
  max_reviews: 20000,
  max_weight_kg: 30,
  max_dimensions: "",
  flat_pack: false,
  assembly_required: false,
  suitable_b2b: true,
  suitable_amazon: true,
  suitable_website: true,
  market: "amazon_uk",
  sources: [],
  page: 1,
  page_size: 5,
  sort_by: "reviews",
  sort_order: "desc",
};

function normalizeStoredQuery(input: unknown): DiscoverySearchQuery {
  const source = input as Partial<DiscoverySearchQuery> | null;
  if (!source || typeof source !== "object") {
    return DEFAULT_QUERY;
  }

  const safeKeyword = typeof source.keyword === "string" && source.keyword.trim().length > 0
    ? source.keyword
    : DEFAULT_QUERY.keyword;
  const safeCategory = typeof source.category === "string" ? source.category : DEFAULT_QUERY.category;
  const safeProductName = typeof source.product_name === "string" ? source.product_name : DEFAULT_QUERY.product_name;
  const safeBrand = typeof source.brand === "string" ? source.brand : DEFAULT_QUERY.brand;
  const safeMarketplace = typeof source.marketplace === "string" ? source.marketplace : DEFAULT_QUERY.marketplace;
  const safeCountry = typeof source.country === "string" ? source.country : DEFAULT_QUERY.country;
  const safeMaterial = typeof source.material === "string" ? source.material : DEFAULT_QUERY.material;
  const safeMinPrice = typeof source.min_price === "number" && Number.isFinite(source.min_price)
    ? Math.max(0, source.min_price)
    : DEFAULT_QUERY.min_price;
  const safeMaxPrice = typeof source.max_price === "number" && Number.isFinite(source.max_price)
    ? Math.max(0, source.max_price)
    : DEFAULT_QUERY.max_price;
  const safeSellingPriceMin = typeof source.selling_price_min === "number" && Number.isFinite(source.selling_price_min)
    ? Math.max(0, source.selling_price_min)
    : DEFAULT_QUERY.selling_price_min;
  const safeSellingPriceMax = typeof source.selling_price_max === "number" && Number.isFinite(source.selling_price_max)
    ? Math.max(0, source.selling_price_max)
    : DEFAULT_QUERY.selling_price_max;
  const safeMinRating = typeof source.min_rating === "number" && Number.isFinite(source.min_rating)
    ? Math.min(5, Math.max(0, source.min_rating))
    : DEFAULT_QUERY.min_rating;
  const safeMaxRating = typeof source.max_rating === "number" && Number.isFinite(source.max_rating)
    ? Math.min(5, Math.max(0, source.max_rating))
    : DEFAULT_QUERY.max_rating;
  const safeMinReviews = typeof source.min_reviews === "number" && Number.isFinite(source.min_reviews)
    ? Math.max(0, source.min_reviews)
    : DEFAULT_QUERY.min_reviews;
  const safeMaxReviews = typeof source.max_reviews === "number" && Number.isFinite(source.max_reviews)
    ? Math.max(0, source.max_reviews)
    : DEFAULT_QUERY.max_reviews;
  const safeMaxWeight = typeof source.max_weight_kg === "number" && Number.isFinite(source.max_weight_kg)
    ? Math.max(0, source.max_weight_kg)
    : DEFAULT_QUERY.max_weight_kg;
  const safeMaxDimensions = typeof source.max_dimensions === "string" ? source.max_dimensions : DEFAULT_QUERY.max_dimensions;
  const safeFlatPack = typeof source.flat_pack === "boolean" ? source.flat_pack : DEFAULT_QUERY.flat_pack;
  const safeAssembly = typeof source.assembly_required === "boolean" ? source.assembly_required : DEFAULT_QUERY.assembly_required;
  const safeSuitableB2B = typeof source.suitable_b2b === "boolean" ? source.suitable_b2b : DEFAULT_QUERY.suitable_b2b;
  const safeSuitableAmazon = typeof source.suitable_amazon === "boolean" ? source.suitable_amazon : DEFAULT_QUERY.suitable_amazon;
  const safeSuitableWebsite = typeof source.suitable_website === "boolean" ? source.suitable_website : DEFAULT_QUERY.suitable_website;
  const safeMarket = typeof source.market === "string" && MARKET_OPTIONS.includes(source.market)
    ? source.market
    : DEFAULT_QUERY.market;
  const safeSources = Array.isArray(source.sources)
    ? source.sources.filter((value): value is string => typeof value === "string" && SOURCE_OPTIONS.includes(value))
    : DEFAULT_QUERY.sources;
  const safePage = typeof source.page === "number" && Number.isFinite(source.page)
    ? Math.max(1, Math.floor(source.page))
    : DEFAULT_QUERY.page;
  const safePageSize = typeof source.page_size === "number" && Number.isFinite(source.page_size) && PAGE_SIZE_OPTIONS.includes(source.page_size)
    ? source.page_size
    : DEFAULT_QUERY.page_size;
  const safeSortBy = source.sort_by === "title" || source.sort_by === "price" || source.sort_by === "rating" || source.sort_by === "reviews"
    ? source.sort_by
    : DEFAULT_QUERY.sort_by;
  const safeSortOrder = source.sort_order === "asc" || source.sort_order === "desc"
    ? source.sort_order
    : DEFAULT_QUERY.sort_order;

  return {
    product_name: safeProductName,
    keyword: safeKeyword,
    category: safeCategory,
    brand: safeBrand,
    marketplace: safeMarketplace,
    country: safeCountry,
    material: safeMaterial,
    min_price: safeMinPrice,
    max_price: safeMaxPrice,
    selling_price_min: safeSellingPriceMin,
    selling_price_max: safeSellingPriceMax,
    min_rating: safeMinRating,
    max_rating: safeMaxRating,
    min_reviews: safeMinReviews,
    max_reviews: safeMaxReviews,
    max_weight_kg: safeMaxWeight,
    max_dimensions: safeMaxDimensions,
    flat_pack: safeFlatPack,
    assembly_required: safeAssembly,
    suitable_b2b: safeSuitableB2B,
    suitable_amazon: safeSuitableAmazon,
    suitable_website: safeSuitableWebsite,
    market: safeMarket,
    sources: safeSources,
    page: safePage,
    page_size: safePageSize,
    sort_by: safeSortBy,
    sort_order: safeSortOrder,
  };
}

function parseQueryFromUrl(search: string): Partial<DiscoverySearchQuery> {
  const params = new URLSearchParams(search);

  const parsed: Partial<DiscoverySearchQuery> = {};

  const keyword = params.get("keyword");
  if (keyword !== null) {
    parsed.keyword = keyword;
  }

  const productName = params.get("product_name");
  if (productName !== null) {
    parsed.product_name = productName;
  }

  const category = params.get("category");
  if (category !== null) {
    parsed.category = category;
  }

  const brand = params.get("brand");
  if (brand !== null) {
    parsed.brand = brand;
  }

  const country = params.get("country");
  if (country !== null) {
    parsed.country = country;
  }

  const material = params.get("material");
  if (material !== null) {
    parsed.material = material;
  }

  const minPrice = params.get("min_price");
  if (minPrice !== null) {
    const parsedMinPrice = Number(minPrice);
    if (Number.isFinite(parsedMinPrice)) {
      parsed.min_price = parsedMinPrice;
    }
  }

  const maxPrice = params.get("max_price");
  if (maxPrice !== null) {
    const parsedMaxPrice = Number(maxPrice);
    if (Number.isFinite(parsedMaxPrice)) {
      parsed.max_price = parsedMaxPrice;
    }
  }

  const market = params.get("market");
  if (market !== null) {
    parsed.market = market;
  }

  const sourcesParam = params.get("sources");
  if (sourcesParam !== null) {
    parsed.sources = sourcesParam.split(",").map((value) => value.trim()).filter(Boolean);
  }

  const page = params.get("page");
  if (page !== null) {
    const parsedPage = Number(page);
    if (Number.isFinite(parsedPage)) {
      parsed.page = parsedPage;
    }
  }

  const pageSize = params.get("page_size");
  if (pageSize !== null) {
    const parsedPageSize = Number(pageSize);
    if (Number.isFinite(parsedPageSize)) {
      parsed.page_size = parsedPageSize;
    }
  }

  const sortBy = params.get("sort_by");
  if (sortBy !== null) {
    parsed.sort_by = sortBy as DiscoverySearchQuery["sort_by"];
  }

  const sortOrder = params.get("sort_order");
  if (sortOrder !== null) {
    parsed.sort_order = sortOrder as DiscoverySearchQuery["sort_order"];
  }

  return parsed;
}

function toUrlSearch(query: DiscoverySearchQuery): string {
  const params = new URLSearchParams();
  params.set("product_name", query.product_name ?? "");
  params.set("keyword", query.keyword);
  params.set("category", query.category ?? "");
  params.set("brand", query.brand ?? "");
  params.set("country", query.country ?? "");
  params.set("material", query.material ?? "");
  params.set("min_price", String(query.min_price));
  params.set("max_price", String(query.max_price));
  params.set("market", query.market);
  if (query.sources.length > 0) {
    params.set("sources", query.sources.join(","));
  }
  params.set("page", String(query.page));
  params.set("page_size", String(query.page_size));
  params.set("sort_by", query.sort_by);
  params.set("sort_order", query.sort_order);
  return params.toString();
}

function DiscoveryThumbnail({ imageUrl, title }: { imageUrl?: string | null; title: string }) {
  const [hasLoadError, setHasLoadError] = useState(false);

  if (!imageUrl || hasLoadError) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
        N/A
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={title}
      width={48}
      height={48}
      className="h-12 w-12 rounded-md border border-slate-200 object-cover"
      onError={() => setHasLoadError(true)}
    />
  );
}

export function DiscoveryWorkbench() {
  const router = useRouter();
  const [query, setQuery] = useState<DiscoverySearchQuery>(DEFAULT_QUERY);
  const [queryHydrated, setQueryHydrated] = useState(false);
  const userEditedQueryRef = useRef(false);
  const [result, setResult] = useState<DiscoverySearchResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveMessageTone, setSaveMessageTone] = useState<"success" | "error">("success");
  const [savedRowKeys, setSavedRowKeys] = useState<Set<string>>(new Set());
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisItem[]>([]);
  const [savedListBusy, setSavedListBusy] = useState(false);
  const [deletingAnalysisId, setDeletingAnalysisId] = useState<number | null>(null);
  const [savedFilter, setSavedFilter] = useState("");
  const [selectedSavedAnalysisId, setSelectedSavedAnalysisId] = useState<number | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
  const [rejectedRowKeys, setRejectedRowKeys] = useState<Set<string>>(new Set());
  const [researchNotesByRow, setResearchNotesByRow] = useState<Record<string, string>>({});
  const [statusByRow, setStatusByRow] = useState<Record<string, string>>({});
  const [folderByRow, setFolderByRow] = useState<Record<string, string>>({});

  const visibleCandidates = useMemo(() => {
    const rows = result?.items ?? [];
    return rows.filter((item) => {
      if (rejectedRowKeys.has(getRowKey(item))) {
        return false;
      }

      if (query.product_name && !item.title.toLowerCase().includes(query.product_name.toLowerCase())) {
        return false;
      }

      if (query.brand && !(item.brand ?? "").toLowerCase().includes(query.brand.toLowerCase())) {
        return false;
      }

      if (query.material && !(item.material ?? "").toLowerCase().includes(query.material.toLowerCase())) {
        return false;
      }

      if (typeof query.min_rating === "number" && item.rating < query.min_rating) {
        return false;
      }

      if (typeof query.max_rating === "number" && item.rating > query.max_rating) {
        return false;
      }

      if (typeof query.min_reviews === "number" && item.reviews < query.min_reviews) {
        return false;
      }

      if (typeof query.max_reviews === "number" && item.reviews > query.max_reviews) {
        return false;
      }

      if (typeof query.max_weight_kg === "number" && item.weight_kg !== null && item.weight_kg > query.max_weight_kg) {
        return false;
      }

      return true;
    });
  }, [query, rejectedRowKeys, result?.items]);
  const selectableRowKeys = visibleCandidates
    .map((item) => getRowKey(item))
    .filter((rowKey) => !savedRowKeys.has(rowKey));
  const selectedSelectableCount = selectableRowKeys.filter((rowKey) => selectedRowKeys.has(rowKey)).length;
  const allVisibleSelectableSelected = selectableRowKeys.length > 0 && selectedSelectableCount === selectableRowKeys.length;

  const totalPages = useMemo(() => {
    if (!result) return 1;
    return Math.max(1, Math.ceil(result.totalCount / result.pageSize));
  }, [result]);

  const filteredSavedAnalyses = useMemo(() => {
    const keyword = savedFilter.trim().toLowerCase();
    if (!keyword) {
      return savedAnalyses;
    }

    return savedAnalyses.filter((item) => {
      return (
        item.product_name.toLowerCase().includes(keyword)
        || item.source.toLowerCase().includes(keyword)
        || item.market.toLowerCase().includes(keyword)
        || String(item.id).includes(keyword)
      );
    });
  }, [savedAnalyses, savedFilter]);

  const selectedSavedAnalysis = useMemo(() => {
    if (!savedAnalyses.length) {
      return null;
    }

    const selected = savedAnalyses.find((item) => item.id === selectedSavedAnalysisId);
    return selected ?? savedAnalyses[0];
  }, [savedAnalyses, selectedSavedAnalysisId]);

  const savedSummary = useMemo(() => {
    if (!savedAnalyses.length) {
      return {
        count: 0,
        avgOpportunity: 0,
        avgProfit: 0,
        avgCompetition: 0,
      };
    }

    const totals = savedAnalyses.reduce(
      (acc, item) => {
        acc.opportunity += item.opportunity_score;
        acc.profit += item.estimated_profit_percent;
        acc.competition += item.competition_score;
        return acc;
      },
      { opportunity: 0, profit: 0, competition: 0 }
    );

    return {
      count: savedAnalyses.length,
      avgOpportunity: Math.round(totals.opportunity / savedAnalyses.length),
      avgProfit: Math.round(totals.profit / savedAnalyses.length),
      avgCompetition: Math.round(totals.competition / savedAnalyses.length),
    };
  }, [savedAnalyses]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setQueryHydrated(true);
      return;
    }

    try {
      const urlQuery = parseQueryFromUrl(window.location.search);
      const raw = window.localStorage.getItem(DISCOVERY_QUERY_STORAGE_KEY);
      if (raw) {
        const storedQuery = normalizeStoredQuery(JSON.parse(raw));
        const merged = normalizeStoredQuery({ ...storedQuery, ...urlQuery });
        if (!userEditedQueryRef.current) {
          setQuery(merged);
        }
      } else {
        if (!userEditedQueryRef.current) {
          setQuery(normalizeStoredQuery(urlQuery));
        }
      }
    } catch {
      // Ignore malformed local storage payloads and continue with defaults.
    } finally {
      setQueryHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!queryHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(DISCOVERY_QUERY_STORAGE_KEY, JSON.stringify(query));

    const nextSearch = toUrlSearch(query);
    const nextUrl = `${window.location.pathname}?${nextSearch}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [query, queryHydrated]);

  async function runSearch(nextQuery: DiscoverySearchQuery) {
    setBusy(true);
    setError(null);
    try {
      const data = await fetchDiscoveryProducts(nextQuery);
      setResult(data);
      const savedKeys = await fetchSavedDiscoveryRowKeys(
        data.items.map((item) => ({
          source: item.source,
          title: item.title,
          market: nextQuery.market,
        }))
      );
      setSavedRowKeys(savedKeys);
      setSelectedRowKeys(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = { ...query, page: 1 };
    setQuery(nextQuery);
    await runSearch(nextQuery);
  }

  async function changePage(direction: "prev" | "next") {
    if (!result) return;
    const nextPage = direction === "prev" ? Math.max(1, query.page - 1) : Math.min(totalPages, query.page + 1);
    const nextQuery = { ...query, page: nextPage };
    setQuery(nextQuery);
    await runSearch(nextQuery);
  }

  async function onSortChange(sort_by: DiscoverySearchQuery["sort_by"], sort_order: DiscoverySearchQuery["sort_order"]) {
    const nextQuery = { ...query, sort_by, sort_order, page: 1 };
    setQuery(nextQuery);
    await runSearch(nextQuery);
  }

  function toggleSource(source: string) {
    userEditedQueryRef.current = true;
    setQuery((prev) => {
      const exists = prev.sources.includes(source);
      const sources = exists ? prev.sources.filter((it) => it !== source) : [...prev.sources, source];
      return { ...prev, sources };
    });
  }

  function toSavePayload(item: ProductCandidate) {
    const reviewSignal = Math.min(100, Math.round(Math.log10(Math.max(item.reviews, 1)) * 28));
    const ratingSignal = Math.round((item.rating / 5) * 100);
    const opportunityScore = Math.max(0, Math.min(100, Math.round((ratingSignal * 0.6) + (reviewSignal * 0.4))));
    const competitionScore = Math.max(0, Math.min(100, Math.round((reviewSignal * 0.75) + (ratingSignal * 0.25))));
    const estimatedProfitPercent = Math.max(5, Math.min(65, Math.round((item.price * 0.35) + (ratingSignal * 0.08))));

    return {
      product_name: item.title,
      source: item.source,
      market: query.market,
      opportunity_score: opportunityScore,
      estimated_profit_percent: estimatedProfitPercent,
      competition_score: competitionScore,
    };
  }

  function getRowKey(item: ProductCandidate) {
    return `${item.source}-${item.title}`;
  }

  function getOpportunityScore(item: ProductCandidate): number {
    const reviewSignal = Math.min(100, Math.round(Math.log10(Math.max(item.reviews, 1)) * 28));
    const ratingSignal = Math.round((item.rating / 5) * 100);
    const priceSignal = Math.max(0, Math.min(100, Math.round(100 - (item.price * 1.2))));
    return Math.max(0, Math.min(100, Math.round((ratingSignal * 0.45) + (reviewSignal * 0.35) + (priceSignal * 0.2))));
  }

  function getChecklistState(score: number): "green" | "yellow" | "red" {
    if (score >= 75) return "green";
    if (score >= 55) return "yellow";
    return "red";
  }

  function toggleComparison(item: ProductCandidate) {
    const rowKey = getRowKey(item);
    setSelectedForComparison((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
        return next;
      }

      if (next.size >= 5) {
        return prev;
      }

      next.add(rowKey);
      return next;
    });
  }

  function rejectCandidate(item: ProductCandidate) {
    const rowKey = getRowKey(item);
    setRejectedRowKeys((prev) => new Set(prev).add(rowKey));
    setSelectedForComparison((prev) => {
      const next = new Set(prev);
      next.delete(rowKey);
      return next;
    });
    setSaveMessageTone("success");
    setSaveMessage(`Rejected ${item.title} from active finder list.`);
  }

  function openResearch(item: ProductCandidate) {
    const rowKey = getRowKey(item);
    const note = researchNotesByRow[rowKey] ?? "Investigate supplier and packaging improvements.";

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "product-studio.researchDraft.v1",
          JSON.stringify({
            productName: item.title,
            note,
          })
        );
      } catch {
        // Ignore storage write errors and still navigate.
      }
    }

    router.push(`/research?product_name=${encodeURIComponent(item.title)}`);
  }

  async function saveCandidate(item: ProductCandidate) {
    const rowKey = getRowKey(item);
    if (savedRowKeys.has(rowKey)) {
      return;
    }
    setSavingKey(rowKey);
    setSaveMessage(null);
    try {
      const payload = toSavePayload(item);
      const saved = await saveProductAnalysis(payload);
      setSavedRowKeys((prev) => new Set(prev).add(rowKey));
      setSaveMessageTone("success");
      setSaveMessage(
        saved.created
          ? `Saved ${item.title} as record #${saved.id}.`
          : `${item.title} is already saved as record #${saved.id}.`
      );
      setSelectedRowKeys((prev) => {
        const next = new Set(prev);
        next.delete(rowKey);
        return next;
      });
      await loadSavedAnalyses();
    } catch (err) {
      setSaveMessageTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingKey(null);
    }
  }

  function toggleSelection(rowKey: string) {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (allVisibleSelectableSelected) {
        selectableRowKeys.forEach((rowKey) => next.delete(rowKey));
      } else {
        selectableRowKeys.forEach((rowKey) => next.add(rowKey));
      }
      return next;
    });
  }

  async function saveSelectedCandidates() {
    const selectedItems = visibleCandidates.filter((item) => {
      const rowKey = getRowKey(item);
      return selectedRowKeys.has(rowKey) && !savedRowKeys.has(rowKey);
    });

    if (!selectedItems.length) {
      return;
    }

    setBulkSaving(true);
    setSaveMessage(null);
    try {
      const response = await saveProductAnalysesBulk(selectedItems.map((item) => toSavePayload(item)));
      const selectedKeys = selectedItems.map((item) => getRowKey(item));
      setSavedRowKeys((prev) => {
        const next = new Set(prev);
        selectedKeys.forEach((rowKey) => next.add(rowKey));
        return next;
      });
      setSelectedRowKeys((prev) => {
        const next = new Set(prev);
        selectedKeys.forEach((rowKey) => next.delete(rowKey));
        return next;
      });
      setSaveMessageTone("success");
      setSaveMessage(`Bulk save complete: ${response.created_count} new, ${response.already_exists_count} existing.`);
      await loadSavedAnalyses();
    } catch (err) {
      setSaveMessageTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Bulk save failed");
    } finally {
      setBulkSaving(false);
    }
  }

  async function loadSavedAnalyses() {
    setSavedListBusy(true);
    try {
      const rows = await fetchSavedAnalyses();
      setSavedAnalyses(rows);
      if (!rows.length) {
        setSelectedSavedAnalysisId(null);
      } else {
        setSelectedSavedAnalysisId((prev) => {
          if (prev && rows.some((item) => item.id === prev)) {
            return prev;
          }
          return rows[0].id;
        });
      }
    } catch (err) {
      setSaveMessageTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to load saved analyses");
    } finally {
      setSavedListBusy(false);
    }
  }

  async function removeSavedAnalysis(item: SavedAnalysisItem) {
    setDeletingAnalysisId(item.id);
    try {
      const deleted = await deleteSavedAnalysis(item.id);
      if (!deleted) {
        setSaveMessageTone("error");
        setSaveMessage(`No saved record found for #${item.id}.`);
        return;
      }

      setSavedAnalyses((prev) => prev.filter((row) => row.id !== item.id));
      setSelectedSavedAnalysisId((prev) => (prev === item.id ? null : prev));
      setSavedRowKeys((prev) => {
        const next = new Set(prev);
        next.delete(`${item.source}-${item.product_name}`);
        return next;
      });
      setSaveMessageTone("success");
      setSaveMessage(`Removed saved record #${item.id}.`);
    } catch (err) {
      setSaveMessageTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to remove saved analysis");
    } finally {
      setDeletingAnalysisId(null);
    }
  }

  return (
    <section className="surface-panel flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Product Finder</h2>
        <p className="text-sm text-slate-700">Decision-support discovery for products Velynxia can manufacture and scale</p>
      </div>

      <div className="workspace-scroll mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
      <div className="sticky top-0 z-10 space-y-3 rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur">
      <form className="grid gap-3 md:grid-cols-10" onSubmit={onSubmit}>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.product_name ?? ""}
          onChange={(e) => {
            const product_name = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, product_name }));
          }}
          placeholder="Product name"
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.keyword}
          onChange={(e) => {
            const keyword = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, keyword }));
          }}
          placeholder="Keyword"
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.category ?? ""}
          onChange={(e) => {
            const category = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, category }));
          }}
          placeholder="Category (optional)"
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.brand ?? ""}
          onChange={(e) => {
            const brand = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, brand }));
          }}
          placeholder="Brand"
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.country ?? "UK"}
          onChange={(e) => {
            const country = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, country }));
          }}
        >
          {COUNTRY_OPTIONS.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.material ?? ""}
          onChange={(e) => {
            const material = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, material }));
          }}
          placeholder="Material"
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.market}
          onChange={(e) => {
            const market = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, market }));
          }}
        >
          {MARKET_OPTIONS.map((market) => (
            <option key={market} value={market}>
              {market}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.marketplace ?? "Amazon"}
          onChange={(e) => {
            const marketplace = e.target.value;
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, marketplace }));
          }}
        >
          {MARKETPLACE_OPTIONS.map((marketplace) => (
            <option key={marketplace} value={marketplace}>{marketplace}</option>
          ))}
        </select>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="number"
          value={query.min_price}
          min={0}
          onChange={(e) => {
            const minPrice = Number(e.target.value);
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, min_price: minPrice }));
          }}
          placeholder="Min price"
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="number"
          value={query.max_price}
          min={0}
          onChange={(e) => {
            const maxPrice = Number(e.target.value);
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, max_price: maxPrice }));
          }}
          placeholder="Max price"
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.page_size}
          onChange={(e) => {
            const pageSize = Number(e.target.value);
            userEditedQueryRef.current = true;
            setQuery((prev) => ({ ...prev, page_size: pageSize, page: 1 }));
          }}
          aria-label="Results per page"
        >
          {PAGE_SIZE_OPTIONS.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} / page
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slateDeep px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs md:grid-cols-6">
        <input
          className="rounded border border-slate-300 px-2 py-1"
          type="number"
          value={query.min_rating ?? 0}
          min={0}
          max={5}
          onChange={(e) => setQuery((prev) => ({ ...prev, min_rating: Number(e.target.value) }))}
          placeholder="Min rating"
        />
        <input
          className="rounded border border-slate-300 px-2 py-1"
          type="number"
          value={query.max_rating ?? 5}
          min={0}
          max={5}
          onChange={(e) => setQuery((prev) => ({ ...prev, max_rating: Number(e.target.value) }))}
          placeholder="Max rating"
        />
        <input
          className="rounded border border-slate-300 px-2 py-1"
          type="number"
          value={query.min_reviews ?? 0}
          min={0}
          onChange={(e) => setQuery((prev) => ({ ...prev, min_reviews: Number(e.target.value) }))}
          placeholder="Min reviews"
        />
        <input
          className="rounded border border-slate-300 px-2 py-1"
          type="number"
          value={query.max_reviews ?? 20000}
          min={0}
          onChange={(e) => setQuery((prev) => ({ ...prev, max_reviews: Number(e.target.value) }))}
          placeholder="Max reviews"
        />
        <input
          className="rounded border border-slate-300 px-2 py-1"
          type="number"
          value={query.max_weight_kg ?? 30}
          min={0}
          onChange={(e) => setQuery((prev) => ({ ...prev, max_weight_kg: Number(e.target.value) }))}
          placeholder="Max weight (kg)"
        />
        <input
          className="rounded border border-slate-300 px-2 py-1"
          value={query.max_dimensions ?? ""}
          onChange={(e) => setQuery((prev) => ({ ...prev, max_dimensions: e.target.value }))}
          placeholder="Max dimensions"
        />
        <label className="flex items-center gap-1 text-slate-700"><input type="checkbox" checked={query.flat_pack ?? false} onChange={(e) => setQuery((prev) => ({ ...prev, flat_pack: e.target.checked }))} />Flat Pack</label>
        <label className="flex items-center gap-1 text-slate-700"><input type="checkbox" checked={query.assembly_required ?? false} onChange={(e) => setQuery((prev) => ({ ...prev, assembly_required: e.target.checked }))} />Assembly Required</label>
        <label className="flex items-center gap-1 text-slate-700"><input type="checkbox" checked={query.suitable_b2b ?? false} onChange={(e) => setQuery((prev) => ({ ...prev, suitable_b2b: e.target.checked }))} />Suitable for B2B</label>
        <label className="flex items-center gap-1 text-slate-700"><input type="checkbox" checked={query.suitable_amazon ?? false} onChange={(e) => setQuery((prev) => ({ ...prev, suitable_amazon: e.target.checked }))} />Suitable for Amazon</label>
        <label className="flex items-center gap-1 text-slate-700"><input type="checkbox" checked={query.suitable_website ?? false} onChange={(e) => setQuery((prev) => ({ ...prev, suitable_website: e.target.checked }))} />Suitable for Website</label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {SOURCE_OPTIONS.map((source) => {
          const selected = query.sources.includes(source);
          return (
            <button
              key={source}
              type="button"
              className={`rounded-full px-3 py-1 ${selected ? "bg-slateDeep text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => toggleSource(source)}
            >
              {source}
            </button>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saveMessage ? (
        <p className={`text-sm ${saveMessageTone === "success" ? "text-emerald-700" : "text-red-600"}`}>
          {saveMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/70 p-2 text-sm">
        <span className="text-slate-600">Sort:</span>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("reviews", "desc")}>Top Reviews</button>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("price", "asc")}>Price Low-High</button>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("rating", "desc")}>Rating High-Low</button>
        <button
          className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 font-medium text-emerald-700 disabled:opacity-50"
          type="button"
          onClick={() => saveSelectedCandidates()}
          disabled={bulkSaving || selectedSelectableCount === 0}
        >
          {bulkSaving ? "Saving Selected..." : `Save Selected (${selectedSelectableCount})`}
        </button>
      </div>
      <div className="workspace-scroll mt-4 w-full max-w-full max-h-[420px] overflow-auto rounded-xl border border-slate-200 bg-white/80">
        <table className="min-w-[1650px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  aria-label="Select all visible unsaved rows"
                  checked={allVisibleSelectableSelected}
                  onChange={() => toggleSelectAllVisible()}
                  disabled={busy || !selectableRowKeys.length}
                />
              </th>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Marketplace</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2">Reviews</th>
              <th className="px-3 py-2">Dimensions</th>
              <th className="px-3 py-2">Weight</th>
              <th className="px-3 py-2">Opportunity</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Folder</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCandidates.map((item) => {
              const rowKey = getRowKey(item);
              const isSaved = savedRowKeys.has(rowKey);
              const isSaving = savingKey === rowKey;
              const opportunityScore = getOpportunityScore(item);
              const checklistColor = getChecklistState(opportunityScore);
              const checklistClass = checklistColor === "green"
                ? "bg-emerald-50 text-emerald-700"
                : checklistColor === "yellow"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700";

              return (
              <tr key={rowKey} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.title}`}
                    checked={selectedRowKeys.has(rowKey)}
                    onChange={() => toggleSelection(rowKey)}
                    disabled={busy || bulkSaving || isSaved || isSaving}
                  />
                </td>
                <td className="px-3 py-2">
                  <DiscoveryThumbnail imageUrl={item.image_url} title={item.title} />
                </td>
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2">{item.brand ?? "Unknown"}</td>
                <td className="px-3 py-2">{item.category ?? (query.category || "General")}</td>
                <td className="px-3 py-2">{item.marketplace ?? query.marketplace ?? "Amazon"}</td>
                <td className="px-3 py-2">{item.price}</td>
                <td className="px-3 py-2">{item.rating}</td>
                <td className="px-3 py-2">{item.reviews}</td>
                <td className="px-3 py-2">{item.dimensions ?? "n/a"}</td>
                <td className="px-3 py-2">{item.weight_kg !== null ? `${item.weight_kg}kg` : "n/a"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-900">{opportunityScore}</span>
                    <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${checklistClass}`}>
                      {checklistColor.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                    value={statusByRow[rowKey] ?? "Idea"}
                    onChange={(event) => setStatusByRow((prev) => ({ ...prev, [rowKey]: event.target.value }))}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                    value={folderByRow[rowKey] ?? "Office"}
                    onChange={(event) => setFolderByRow((prev) => ({ ...prev, [rowKey]: event.target.value }))}
                  >
                    {SAVE_FOLDER_OPTIONS.map((folder) => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                      onClick={() => saveCandidate(item)}
                      disabled={busy || isSaving || isSaved}
                    >
                      {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-indigo-300 px-2 py-1 text-xs font-medium text-indigo-700"
                      onClick={() => toggleComparison(item)}
                    >
                      {selectedForComparison.has(rowKey) ? "Compared" : "Compare"}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-sky-300 px-2 py-1 text-xs font-medium text-sky-700"
                      onClick={() => openResearch(item)}
                    >
                      Research
                    </button>
                    <button
                      type="button"
                      className="rounded border border-rose-300 px-2 py-1 text-xs font-medium text-rose-700"
                      onClick={() => rejectCandidate(item)}
                    >
                      Reject
                    </button>
                    {isSaved ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Saved</span> : null}
                  </div>
                </td>
              </tr>
              );
            })}
            {!busy && visibleCandidates.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={16}>
                  Run search to see discovery results.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
          <h4 className="font-semibold text-slate-900">Opportunity Checklist</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">High Demand</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Good Margin</span>
            <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">Easy Manufacturing</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Flat Pack</span>
            <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">Low Damage Risk</span>
            <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">Low Return Risk</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">B2B Potential</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Can Improve</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Can Brand</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Research Notes</h4>
            <span className="text-slate-500">Comparison selected: {selectedForComparison.size}/5</span>
          </div>
          <textarea
            className="mt-2 h-24 w-full rounded border border-slate-300 p-2 text-xs"
            value={Object.values(researchNotesByRow)[0] ?? ""}
            placeholder="Ideas, improvements, questions, supplier notes, risk, observations"
            onChange={(event) => {
              const firstKey = Object.keys(researchNotesByRow)[0] ?? "global";
              setResearchNotesByRow((prev) => ({ ...prev, [firstKey]: event.target.value }));
            }}
          />
          <p className="mt-2 text-[11px] text-slate-500">Use this panel to store summary insights rather than raw review dumps.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-slate-600">Total: {result?.totalCount ?? 0} | Page {query.page} of {totalPages}</p>
          {result ? (
            <p className="text-xs text-slate-500">
              Catalog rows: {result.catalogRowCount ?? 0} | Skipped malformed rows: {result.skippedRowCount ?? 0}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            type="button"
            onClick={() => changePage("prev")}
            disabled={busy || query.page <= 1}
          >
            Previous
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            type="button"
            onClick={() => changePage("next")}
            disabled={busy || query.page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Saved Records</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
              value={savedFilter}
              onChange={(e) => setSavedFilter(e.target.value)}
              placeholder="Filter saved"
              aria-label="Filter saved records"
            />
            <button
              type="button"
              className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-50"
              onClick={() => loadSavedAnalyses()}
              disabled={savedListBusy}
            >
              {savedListBusy ? "Loading..." : "Refresh Saved"}
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Saved Count</p>
            <p className="font-semibold text-slate-900">{savedSummary.count}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Avg Opportunity</p>
            <p className="font-semibold text-slate-900">{savedSummary.avgOpportunity}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Avg Profit %</p>
            <p className="font-semibold text-slate-900">{savedSummary.avgProfit}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Avg Competition</p>
            <p className="font-semibold text-slate-900">{savedSummary.avgCompetition}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          <div className="workspace-scroll max-h-[300px] overflow-y-scroll overflow-x-hidden rounded-lg border border-slate-200 bg-white lg:col-span-3">
          <table className="w-full table-fixed text-left text-xs">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Market</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSavedAnalyses.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-slate-100 ${selectedSavedAnalysis?.id === item.id ? "bg-emerald-50/50" : ""}`}
                >
                  <td className="px-3 py-2">#{item.id}</td>
                  <td className="px-3 py-2">{item.product_name}</td>
                  <td className="px-3 py-2">{item.source}</td>
                  <td className="px-3 py-2">{item.market}</td>
                  <td className="px-3 py-2">{item.opportunity_score}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                        onClick={() => setSelectedSavedAnalysisId(item.id)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 disabled:opacity-50"
                        onClick={() => removeSavedAnalysis(item)}
                        disabled={deletingAnalysisId === item.id}
                      >
                        {deletingAnalysisId === item.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredSavedAnalyses.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    {savedAnalyses.length ? "No records match this filter." : "No saved records loaded yet. Click Refresh Saved."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-3 text-xs lg:col-span-2">
            <h4 className="font-semibold text-slate-900">Saved Details</h4>
            {selectedSavedAnalysis ? (
              <div className="mt-2 space-y-2 text-slate-700">
                <p><span className="font-medium text-slate-900">Record:</span> #{selectedSavedAnalysis.id}</p>
                <p><span className="font-medium text-slate-900">Product:</span> {selectedSavedAnalysis.product_name}</p>
                <p><span className="font-medium text-slate-900">Source:</span> {selectedSavedAnalysis.source}</p>
                <p><span className="font-medium text-slate-900">Market:</span> {selectedSavedAnalysis.market}</p>
                <div className="rounded border border-slate-200 bg-slate-50 p-2">
                  <p className="font-medium text-slate-900">Scoring Snapshot</p>
                  <p className="mt-1">Opportunity: {selectedSavedAnalysis.opportunity_score}</p>
                  <p>Estimated Profit: {selectedSavedAnalysis.estimated_profit_percent}%</p>
                  <p>Competition: {selectedSavedAnalysis.competition_score}</p>
                </div>
                <button
                  type="button"
                  className="rounded border border-red-200 px-2 py-1 font-medium text-red-700 disabled:opacity-50"
                  onClick={() => removeSavedAnalysis(selectedSavedAnalysis)}
                  disabled={deletingAnalysisId === selectedSavedAnalysis.id}
                >
                  {deletingAnalysisId === selectedSavedAnalysis.id ? "Removing..." : `Remove #${selectedSavedAnalysis.id}`}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-slate-500">No saved record selected yet.</p>
            )}
          </aside>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
