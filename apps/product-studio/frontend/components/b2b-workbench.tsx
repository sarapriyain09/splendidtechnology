"use client";

import { FormEvent, useState } from "react";

import { suggestB2BMarkets } from "@/lib/api";

type B2BInputState = {
  productName: string;
  painPointsText: string;
};

const DEFAULT_INPUT: B2BInputState = {
  productName: "Adjustable Laptop Stand",
  painPointsText: "unstable while typing\nlimited cable management\nhard to adjust angle",
};

function parseLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function B2BWorkbench() {
  const [input, setInput] = useState<B2BInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markets, setMarkets] = useState<string[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await suggestB2BMarkets({
        product_name: input.productName.trim(),
        pain_points: parseLines(input.painPointsText),
      });
      setMarkets(response.potential_markets ?? []);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to suggest B2B markets";
      setError(message);
      setMarkets([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">B2B Opportunity Explorer</h2>
        <p className="text-sm text-slate-700">Identify institutional and wholesale markets most likely to adopt your product concept.</p>
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
            {busy ? "Analyzing..." : "Suggest B2B Markets"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Potential Markets</h3>
        {markets.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run the analysis to generate B2B market suggestions.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {markets.map((market) => (
              <li key={market} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                {market}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
