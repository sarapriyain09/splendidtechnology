"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  DiscoverySearchQuery,
  DiscoverySearchResult,
  ProductCandidate,
  SavedAnalysisItem,
  deleteSavedAnalysis,
  fetchDiscoveryProducts,
  fetchSavedAnalyses,
  fetchSavedDiscoveryRowKeys,
  saveProductAnalysis,
} from "@/lib/api";

const MARKET_OPTIONS = ["amazon_uk", "amazon_eu", "amazon_us", "b2b"];
const SOURCE_OPTIONS = ["amazon_public_api", "etsy_public_api", "alibaba_public_api"];

const DEFAULT_QUERY: DiscoverySearchQuery = {
  keyword: "stand",
  category: "",
  min_price: 0,
  max_price: 100,
  market: "amazon_uk",
  sources: [],
  page: 1,
  page_size: 5,
  sort_by: "reviews",
  sort_order: "desc",
};

export function DiscoveryWorkbench() {
  const [query, setQuery] = useState<DiscoverySearchQuery>(DEFAULT_QUERY);
  const [result, setResult] = useState<DiscoverySearchResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveMessageTone, setSaveMessageTone] = useState<"success" | "error">("success");
  const [savedRowKeys, setSavedRowKeys] = useState<Set<string>>(new Set());
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisItem[]>([]);
  const [savedListBusy, setSavedListBusy] = useState(false);
  const [deletingAnalysisId, setDeletingAnalysisId] = useState<number | null>(null);

  const totalPages = useMemo(() => {
    if (!result) return 1;
    return Math.max(1, Math.ceil(result.totalCount / result.pageSize));
  }, [result]);

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
      await loadSavedAnalyses();
    } catch (err) {
      setSaveMessageTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingKey(null);
    }
  }

  async function loadSavedAnalyses() {
    setSavedListBusy(true);
    try {
      const rows = await fetchSavedAnalyses();
      setSavedAnalyses(rows);
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
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Discovery Workbench</h2>
        <p className="text-sm text-slate-600">Filter, sort, and paginate compliant discovery records</p>
      </div>

      <form className="mt-4 grid gap-3 md:grid-cols-6" onSubmit={onSubmit}>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.keyword}
          onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
          placeholder="Keyword"
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.category ?? ""}
          onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="Category (optional)"
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={query.market}
          onChange={(e) => setQuery((prev) => ({ ...prev, market: e.target.value }))}
        >
          {MARKET_OPTIONS.map((market) => (
            <option key={market} value={market}>
              {market}
            </option>
          ))}
        </select>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="number"
          value={query.min_price}
          min={0}
          onChange={(e) => setQuery((prev) => ({ ...prev, min_price: Number(e.target.value) }))}
          placeholder="Min price"
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="number"
          value={query.max_price}
          min={0}
          onChange={(e) => setQuery((prev) => ({ ...prev, max_price: Number(e.target.value) }))}
          placeholder="Max price"
        />
        <button
          type="submit"
          className="rounded-lg bg-slateDeep px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
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

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {saveMessage ? (
        <p className={`mt-3 text-sm ${saveMessageTone === "success" ? "text-emerald-700" : "text-red-600"}`}>
          {saveMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-600">Sort:</span>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("reviews", "desc")}>Top Reviews</button>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("price", "asc")}>Price Low-High</button>
        <button className="rounded border border-slate-300 px-2 py-1" type="button" onClick={() => onSortChange("rating", "desc")}>Rating High-Low</button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2">Reviews</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(result?.items ?? []).map((item) => {
              const rowKey = getRowKey(item);
              const isSaved = savedRowKeys.has(rowKey);
              const isSaving = savingKey === rowKey;

              return (
              <tr key={rowKey} className="border-t border-slate-100">
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2">{item.source}</td>
                <td className="px-3 py-2">{item.price}</td>
                <td className="px-3 py-2">{item.rating}</td>
                <td className="px-3 py-2">{item.reviews}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                      onClick={() => saveCandidate(item)}
                      disabled={busy || isSaving || isSaved}
                    >
                      {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                    </button>
                    {isSaved ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Saved</span> : null}
                  </div>
                </td>
              </tr>
              );
            })}
            {!busy && (result?.items.length ?? 0) === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={6}>
                  Run search to see discovery results.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-slate-600">Total: {result?.totalCount ?? 0} | Page {query.page} of {totalPages}</p>
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

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Saved Records</h3>
          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-50"
            onClick={() => loadSavedAnalyses()}
            disabled={savedListBusy}
          >
            {savedListBusy ? "Loading..." : "Refresh Saved"}
          </button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-xs">
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
              {savedAnalyses.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">#{item.id}</td>
                  <td className="px-3 py-2">{item.product_name}</td>
                  <td className="px-3 py-2">{item.source}</td>
                  <td className="px-3 py-2">{item.market}</td>
                  <td className="px-3 py-2">{item.opportunity_score}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 disabled:opacity-50"
                      onClick={() => removeSavedAnalysis(item)}
                      disabled={deletingAnalysisId === item.id}
                    >
                      {deletingAnalysisId === item.id ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
              {!savedAnalyses.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    No saved records loaded yet. Click Refresh Saved.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
