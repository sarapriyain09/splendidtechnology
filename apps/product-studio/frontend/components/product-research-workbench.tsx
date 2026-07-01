"use client";

import { FormEvent, useState } from "react";

import { OpportunityConcept, generateOpportunityConcepts } from "@/lib/api";

type ProductResearchInputState = {
  productName: string;
  painPointsText: string;
};

const DEFAULT_INPUT: ProductResearchInputState = {
  productName: "Adjustable Laptop Stand",
  painPointsText: "wobbly while typing\npoor cable routing\nawkward angle lock",
};

function parseLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProductResearchWorkbench() {
  const [input, setInput] = useState<ProductResearchInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<OpportunityConcept[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await generateOpportunityConcepts({
        product_name: input.productName.trim(),
        pain_points: parseLines(input.painPointsText),
      });
      setConcepts(response.concepts ?? []);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to generate product concepts";
      setError(message);
      setConcepts([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Product Research</h2>
        <p className="text-sm text-slate-700">Turn customer pain points into actionable product concept variants.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Product Name</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.productName}
            onChange={(event) => setInput((prev) => ({ ...prev, productName: event.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Pain Points (one per line)</span>
          <textarea
            className="min-h-28 rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.painPointsText}
            onChange={(event) => setInput((prev) => ({ ...prev, painPointsText: event.target.value }))}
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Generating..." : "Generate Concepts"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Concept Output</h3>
        {concepts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run concept generation to view recommended variants.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {concepts.map((concept) => (
              <article key={concept.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <h4 className="text-sm font-semibold text-slate-900">{concept.name}</h4>
                <p className="mt-1 text-sm text-slate-700">{concept.improvement}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
