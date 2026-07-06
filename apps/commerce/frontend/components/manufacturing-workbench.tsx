"use client";

import { FormEvent, useState } from "react";

import { fetchManufacturingRecommendations } from "@/lib/api";

type ManufacturingInputState = {
  productName: string;
  painPointsText: string;
};

const DEFAULT_INPUT: ManufacturingInputState = {
  productName: "Adjustable Laptop Stand",
  painPointsText: "assembly takes too long\nparts loosen over time\nshipping damage risk",
};

function parseLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ManufacturingWorkbench() {
  const [input, setInput] = useState<ManufacturingInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<string[]>([]);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetchManufacturingRecommendations({
        product_name: input.productName.trim(),
        pain_points: parseLines(input.painPointsText),
      });
      setMaterials(response.materials ?? []);
      setOptimizations(response.cnc_optimizations ?? []);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to load manufacturing recommendations";
      setError(message);
      setMaterials([]);
      setOptimizations([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Manufacturing Intelligence</h2>
        <p className="text-sm text-slate-700">Generate suggested material stacks and CNC optimizations based on product pain points.</p>
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
          <span className="text-xs font-semibold text-slate-700">Manufacturing Pain Points (one per line)</span>
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
            {busy ? "Generating..." : "Generate Recommendations"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">Suggested Materials</h3>
          {materials.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No materials generated yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {materials.map((item) => (
                <li key={item} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">CNC Optimizations</h3>
          {optimizations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No CNC recommendations generated yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {optimizations.map((item) => (
                <li key={item} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
