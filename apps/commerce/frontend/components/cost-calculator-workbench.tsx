"use client";

import { FormEvent, useState } from "react";

import { ManufacturingCostEstimateRequest, ManufacturingCostEstimateResponse, estimateManufacturingCost } from "@/lib/api";

const DEFAULT_INPUT: ManufacturingCostEstimateRequest = {
  product_name: "Adjustable Laptop Stand",
  target_market: "amazon_uk",
  selling_price: 49.99,
  country: "China",
  material_cost: 8.5,
  labour_cost: 4,
  packaging_cost: 1.8,
  shipping_cost: 3.5,
  import_duty_cost: 1.2,
  amazon_fee_cost: 7.25,
  storage_cost: 0.95,
  advertising_cost: 3,
};

export function CostCalculatorWorkbench() {
  const [input, setInput] = useState<ManufacturingCostEstimateRequest>(DEFAULT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ManufacturingCostEstimateResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await estimateManufacturingCost(input);
      setResult(response);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to estimate cost";
      setError(message);
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  function updateNumberField<K extends keyof ManufacturingCostEstimateRequest>(key: K, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Cost Calculator</h2>
        <p className="text-sm text-slate-700">Estimate total cost and projected margin for your target market before committing to production.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-1 xl:col-span-2">
          <span className="text-xs font-semibold text-slate-700">Product Name</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.product_name}
            onChange={(event) => setInput((prev) => ({ ...prev, product_name: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Target Market</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.target_market}
            onChange={(event) => setInput((prev) => ({ ...prev, target_market: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Country</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.country}
            onChange={(event) => setInput((prev) => ({ ...prev, country: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Selling Price</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={input.selling_price}
            onChange={(event) => updateNumberField("selling_price", Number(event.target.value))}
          />
        </label>

        {([
          ["material_cost", "Material"],
          ["labour_cost", "Labour"],
          ["packaging_cost", "Packaging"],
          ["shipping_cost", "Shipping"],
          ["import_duty_cost", "Import Duty"],
          ["amazon_fee_cost", "Amazon Fee"],
          ["storage_cost", "Storage"],
          ["advertising_cost", "Advertising"],
        ] as const).map(([field, label]) => (
          <label key={field} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">{label} Cost</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              value={input[field]}
              onChange={(event) => updateNumberField(field, Number(event.target.value))}
            />
          </label>
        ))}

        <div className="flex items-end xl:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Calculating..." : "Calculate Cost"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Estimate Result</h3>
        {result ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-600">Total Cost</p>
              <p className="text-xl font-semibold text-slate-900">{result.total_cost.toFixed(2)}</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-600">Estimated Profit</p>
              <p className="text-xl font-semibold text-slate-900">{result.estimated_profit.toFixed(2)}</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-600">Profit %</p>
              <p className="text-xl font-semibold text-slate-900">{result.profit_percent.toFixed(2)}%</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Enter values and run calculation to see projected profitability.</p>
        )}
      </section>
    </div>
  );
}
