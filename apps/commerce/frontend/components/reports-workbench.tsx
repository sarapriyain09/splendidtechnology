"use client";

import { useMemo } from "react";

import { SavedAnalysisItem } from "@/lib/api";

type ReportsWorkbenchProps = {
  items: SavedAnalysisItem[];
};

export function ReportsWorkbench({ items }: ReportsWorkbenchProps) {
  const summary = useMemo(() => {
    if (!items.length) {
      return {
        count: 0,
        avgOpportunity: 0,
        avgProfit: 0,
        avgCompetition: 0,
        topMarket: "-",
      };
    }

    const totals = items.reduce(
      (acc, item) => {
        acc.opportunity += item.opportunity_score;
        acc.profit += item.estimated_profit_percent;
        acc.competition += item.competition_score;
        acc.marketCount[item.market] = (acc.marketCount[item.market] ?? 0) + 1;
        return acc;
      },
      {
        opportunity: 0,
        profit: 0,
        competition: 0,
        marketCount: {} as Record<string, number>,
      },
    );

    const topMarket = Object.entries(totals.marketCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    return {
      count: items.length,
      avgOpportunity: Math.round(totals.opportunity / items.length),
      avgProfit: Math.round(totals.profit / items.length),
      avgCompetition: Math.round(totals.competition / items.length),
      topMarket,
    };
  }, [items]);

  const topFive = useMemo(() => {
    return [...items]
      .sort((a, b) => b.opportunity_score - a.opportunity_score)
      .slice(0, 5);
  }, [items]);

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-700">Portfolio summary generated from saved discovery records.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Saved Products</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.count}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Avg Opportunity</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.avgOpportunity}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Avg Profit %</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.avgProfit}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Avg Competition</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.avgCompetition}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Top Market</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.topMarket}</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Top Opportunities</h3>
        {topFive.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No saved analyses yet. Save records from Discovery to populate reports.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Market</th>
                  <th className="px-3 py-2">Opportunity</th>
                  <th className="px-3 py-2">Profit %</th>
                  <th className="px-3 py-2">Competition</th>
                </tr>
              </thead>
              <tbody>
                {topFive.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.product_name}</td>
                    <td className="px-3 py-2">{item.source}</td>
                    <td className="px-3 py-2">{item.market}</td>
                    <td className="px-3 py-2">{item.opportunity_score}</td>
                    <td className="px-3 py-2">{item.estimated_profit_percent}</td>
                    <td className="px-3 py-2">{item.competition_score}</td>
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
