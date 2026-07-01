"use client";

import { FormEvent, useMemo, useState } from "react";
import { useEffect } from "react";

import { ReviewPainPoint, analyzeReviewPainPoints } from "@/lib/api";

type ReviewInputState = {
  productName: string;
  oneStar: string;
  twoStar: string;
  threeStar: string;
};

const DEFAULT_INPUT: ReviewInputState = {
  productName: "Adjustable Laptop Stand",
  oneStar: "Broke in two weeks\nWobbly when typing\nScrews came loose quickly",
  twoStar: "Hard to adjust angle\nEdges feel cheap",
  threeStar: "Decent idea but unstable on larger laptops",
};

function parseLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderPainPointLabel(point: ReviewPainPoint | string): string {
  if (typeof point === "string") {
    return point;
  }

  if (point.term) {
    return point.term;
  }

  if (point.pain_point) {
    return point.pain_point;
  }

  return JSON.stringify(point);
}

function renderPainPointCount(point: ReviewPainPoint | string): string {
  if (typeof point === "string") {
    return "";
  }

  if (typeof point.mentions === "number") {
    return `${point.mentions} mentions`;
  }

  if (typeof point.count === "number") {
    return `${point.count} mentions`;
  }

  return "";
}

export function ReviewIntelligenceWorkbench() {
  const [input, setInput] = useState<ReviewInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [painPoints, setPainPoints] = useState<Array<ReviewPainPoint | string>>([]);

  const totalInputLines = useMemo(() => {
    return parseLines(input.oneStar).length + parseLines(input.twoStar).length + parseLines(input.threeStar).length;
  }, [input.oneStar, input.twoStar, input.threeStar]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const productNameFromQuery = params.get("product_name")?.trim();

    let productNameFromDraft = "";
    try {
      const rawDraft = window.localStorage.getItem("product-studio.researchDraft.v1");
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as { productName?: string };
        productNameFromDraft = parsed.productName?.trim() ?? "";
      }
    } catch {
      // Ignore malformed draft payloads.
    }

    const nextProductName = productNameFromQuery || productNameFromDraft;
    if (nextProductName) {
      setInput((prev) => ({ ...prev, productName: nextProductName }));
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await analyzeReviewPainPoints({
        product_name: input.productName.trim(),
        one_star: parseLines(input.oneStar),
        two_star: parseLines(input.twoStar),
        three_star: parseLines(input.threeStar),
      });

      setPainPoints(response.top_pain_points ?? []);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to analyze reviews";
      setError(message);
      setPainPoints([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <header className="shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900">Review Intelligence</h2>
        <p className="text-sm text-slate-700">Analyze low-star reviews to extract recurring pain points for product improvement.</p>
      </header>

      <div className="workspace-scroll flex-1 min-h-0 overflow-y-auto pr-1">
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1 lg:col-span-2">
          <span className="text-xs font-semibold text-slate-700">Product Name</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.productName}
            onChange={(event) => setInput((prev) => ({ ...prev, productName: event.target.value }))}
            placeholder="Product name"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">1-Star Reviews (one per line)</span>
          <textarea
            className="min-h-32 rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.oneStar}
            onChange={(event) => setInput((prev) => ({ ...prev, oneStar: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">2-Star Reviews (one per line)</span>
          <textarea
            className="min-h-32 rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.twoStar}
            onChange={(event) => setInput((prev) => ({ ...prev, twoStar: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1 lg:col-span-2">
          <span className="text-xs font-semibold text-slate-700">3-Star Reviews (one per line)</span>
          <textarea
            className="min-h-28 rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.threeStar}
            onChange={(event) => setInput((prev) => ({ ...prev, threeStar: event.target.value }))}
          />
        </label>

        <div className="flex items-center justify-between lg:col-span-2">
          <p className="text-xs text-slate-600">Total review lines: {totalInputLines}</p>
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Analyzing..." : "Analyze Pain Points"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Top Pain Points</h3>
        {painPoints.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run analysis to see extracted pain points.</p>
        ) : (
          <ol className="mt-3 space-y-2 text-sm text-slate-800">
            {painPoints.map((point, index) => (
              <li key={`${renderPainPointLabel(point)}-${index}`} className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{index + 1}. {renderPainPointLabel(point)}</span>
                  {renderPainPointCount(point) ? (
                    <span className="text-xs text-slate-600">{renderPainPointCount(point)}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
      </div>
    </div>
  );
}
