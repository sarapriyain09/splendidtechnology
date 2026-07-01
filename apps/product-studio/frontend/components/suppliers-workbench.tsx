"use client";

import { FormEvent, useState } from "react";

import { DiscoverySearchResult, fetchDiscoveryProducts } from "@/lib/api";

type SuppliersInputState = {
  keyword: string;
  market: string;
};

const DEFAULT_INPUT: SuppliersInputState = {
  keyword: "stand",
  market: "b2b",
};

export function SuppliersWorkbench() {
  const [input, setInput] = useState<SuppliersInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoverySearchResult | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetchDiscoveryProducts({
        keyword: input.keyword,
        category: "",
        min_price: 0,
        max_price: 100000,
        market: input.market,
        sources: ["alibaba_public_api"],
        page: 1,
        page_size: 10,
        sort_by: "reviews",
        sort_order: "desc",
      });

      setResult(response);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to load supplier candidates";
      setError(message);
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Suppliers</h2>
        <p className="text-sm text-slate-700">Surface supplier-oriented discovery candidates from compliant source connectors.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-semibold text-slate-700">Keyword</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.keyword}
            onChange={(event) => setInput((prev) => ({ ...prev, keyword: event.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Market</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.market}
            onChange={(event) => setInput((prev) => ({ ...prev, market: event.target.value }))}
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Loading..." : "Find Supplier Candidates"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Supplier Candidate List</h3>
        {!result || result.items.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run search to view supplier candidates.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={`${item.source}-${item.title}`} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.title}</td>
                    <td className="px-3 py-2">{item.source}</td>
                    <td className="px-3 py-2">{item.price}</td>
                    <td className="px-3 py-2">{item.rating}</td>
                    <td className="px-3 py-2">{item.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
