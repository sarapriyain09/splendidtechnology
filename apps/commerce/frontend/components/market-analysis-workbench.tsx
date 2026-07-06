"use client";

import { FormEvent, useState } from "react";

import { CompetitionAnalysisRequest, analyzeCompetition } from "@/lib/api";

const DEFAULT_INPUT: CompetitionAnalysisRequest = {
  number_of_sellers: 42,
  average_reviews: 820,
  average_rating: 4.2,
  price_std_deviation: 8.5,
  brand_dominance: 55,
};

export function MarketAnalysisWorkbench() {
  const [input, setInput] = useState<CompetitionAnalysisRequest>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await analyzeCompetition(input);
      setScore(response.competition_score);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to run market analysis";
      setError(message);
      setScore(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Market Analysis</h2>
        <p className="text-sm text-slate-700">Estimate competitive pressure using seller density, review volume, ratings, and brand dominance.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Number of Sellers</span>
          <input
            type="number"
            min={0}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.number_of_sellers}
            onChange={(event) => setInput((prev) => ({ ...prev, number_of_sellers: Number(event.target.value) }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Average Reviews</span>
          <input
            type="number"
            min={0}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.average_reviews}
            onChange={(event) => setInput((prev) => ({ ...prev, average_reviews: Number(event.target.value) }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Average Rating</span>
          <input
            type="number"
            min={0}
            max={5}
            step="0.1"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.average_rating}
            onChange={(event) => setInput((prev) => ({ ...prev, average_rating: Number(event.target.value) }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Price Std Deviation</span>
          <input
            type="number"
            min={0}
            step="0.1"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.price_std_deviation}
            onChange={(event) => setInput((prev) => ({ ...prev, price_std_deviation: Number(event.target.value) }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Brand Dominance (0-100)</span>
          <input
            type="number"
            min={0}
            max={100}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.brand_dominance}
            onChange={(event) => setInput((prev) => ({ ...prev, brand_dominance: Number(event.target.value) }))}
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Analyzing..." : "Run Market Analysis"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Competition Score</h3>
        {score === null ? (
          <p className="mt-2 text-sm text-slate-600">Submit parameters to calculate competition score.</p>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            <p className="text-3xl font-bold text-slate-900">{score}</p>
            <p className="text-sm text-slate-700">
              {score >= 75 ? "High competition" : score >= 50 ? "Moderate competition" : "Lower competition"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
