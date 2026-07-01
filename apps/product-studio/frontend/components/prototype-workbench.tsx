"use client";

import { FormEvent, useState } from "react";

import { generateProductFamily } from "@/lib/api";

type PrototypeInputState = {
  productName: string;
  painPointsText: string;
};

const DEFAULT_INPUT: PrototypeInputState = {
  productName: "Adjustable Laptop Stand",
  painPointsText: "hard to assemble\nunstable under load\nnot compact for shipping",
};

function parseLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function PrototypeWorkbench() {
  const [input, setInput] = useState<PrototypeInputState>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [family, setFamily] = useState<string[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await generateProductFamily({
        product_name: input.productName.trim(),
        pain_points: parseLines(input.painPointsText),
      });
      setFamily(response.product_family ?? []);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to generate prototype family roadmap";
      setError(message);
      setFamily([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Prototype Roadmap</h2>
        <p className="text-sm text-slate-700">Generate prototype family variants to guide phased validation and product iteration.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Base Product</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.productName}
            onChange={(event) => setInput((prev) => ({ ...prev, productName: event.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Prototype Constraints / Pain Points</span>
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
            {busy ? "Generating..." : "Generate Prototype Roadmap"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Prototype Family</h3>
        {family.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Generate roadmap to view suggested prototype progression.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {family.map((item, index) => (
              <li key={item} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
