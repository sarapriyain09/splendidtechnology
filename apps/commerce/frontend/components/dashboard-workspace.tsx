"use client";

import { useState } from "react";

import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import { KpiCard } from "@/components/kpi-card";
import { DashboardOverview } from "@/lib/api";
import { PRODUCT_WORKSPACE_TABS } from "@/lib/design-system/navigation";

type DashboardWorkspaceProps = {
  overview: DashboardOverview;
};

export function DashboardWorkspace({ overview }: DashboardWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<(typeof PRODUCT_WORKSPACE_TABS)[number]>("Overview");

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <section className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {PRODUCT_WORKSPACE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 font-medium ${
                activeTab === tab ? "bg-[#10213d] text-white" : "border border-gray-300 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-3">
        {activeTab === "Overview" ? (
          <div className="grid h-full min-h-0 gap-3 p-1 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <h3 className="text-lg font-semibold text-gray-900">Active Product Projects</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded border border-gray-200 bg-white p-3">
                    <p className="font-semibold text-gray-900">Executive Monitor Stand</p>
                    <p className="text-xs text-gray-600">Stage: Prototype | Progress: 62%</p>
                  </div>
                  <div className="rounded border border-gray-200 bg-white p-3">
                    <p className="font-semibold text-gray-900">Laptop Stand</p>
                    <p className="text-xs text-gray-600">Stage: Research | Progress: 15%</p>
                  </div>
                  <div className="rounded border border-gray-200 bg-white p-3">
                    <p className="font-semibold text-gray-900">Printer Stand</p>
                    <p className="text-xs text-gray-600">Stage: Manufacturing | Progress: 83%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <KpiCard title="Products Analysed" value={String(overview.products_analysed)} hint="Total opportunities processed" />
              <KpiCard title="Top Opportunities" value={String(overview.top_opportunities)} hint="Scored above 75" />
              <KpiCard title="Profit Estimate" value={`${overview.avg_profit_estimate}%`} hint="Average modeled margin" />
            </div>
          </div>
        ) : null}

        {activeTab === "Research" ? <DiscoveryWorkbench /> : null}

        {activeTab === "Competitors" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Market Snapshot</h3>
            <p className="text-sm text-gray-700">
              Competition trend is currently moderate at score <span className="font-semibold">{overview.avg_competition}</span>.
              Focus discovery on lower-competition product clusters for quicker launch cycles.
            </p>
            <p className="text-sm text-gray-700">
              Top opportunities in the pipeline: <span className="font-semibold">{overview.top_opportunities}</span>.
            </p>
          </div>
        ) : null}

        {activeTab === "Reviews" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Review Intelligence</h3>
            <p className="text-sm text-gray-700">
              Use the dedicated <span className="font-semibold">Review Intelligence</span> screen from left navigation to run pain-point extraction from 1-3 star reviews.
            </p>
            <p className="text-sm text-gray-700">The extracted pain points can then guide product concept and packaging improvements.</p>
          </div>
        ) : null}

        {activeTab === "AI Improvement" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">AI Improvement Suggestions</h3>
            <p className="text-sm text-gray-700">Generate versioned design improvements with reasons: premium, smart, eco, modular, and accessory variants.</p>
          </div>
        ) : null}

        {activeTab === "Design" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Design & CAD</h3>
            <p className="text-sm text-gray-700">Attach CAD files, design notes, and versioned visual references for each product project.</p>
          </div>
        ) : null}

        {activeTab === "Prototype" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Prototype</h3>
            <p className="text-sm text-gray-700">Track Version 1, 2, and 3 with test outcomes, issues, photos, and videos.</p>
          </div>
        ) : null}

        {activeTab === "Supplier" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Supplier</h3>
            <p className="text-sm text-gray-700">Store supplier shortlist, factory details, MOQ, and qualification status.</p>
          </div>
        ) : null}

        {activeTab === "Manufacturing" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Manufacturing Notes</h3>
            <p className="text-sm text-gray-700">Manufacturing workflows are available from the dedicated module routes in the left navigation.</p>
          </div>
        ) : null}

        {activeTab === "Cost" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Cost Summary</h3>
            <p className="text-sm text-gray-700">
              Average estimated margin is <span className="font-semibold">{overview.avg_profit_estimate}%</span> across analyzed products.
            </p>
          </div>
        ) : null}

        {activeTab === "Packaging" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Packaging</h3>
            <p className="text-sm text-gray-700">Plan packaging durability, instruction manuals, and unboxing quality controls.</p>
          </div>
        ) : null}

        {activeTab === "Marketing" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Marketing</h3>
            <p className="text-sm text-gray-700">Generate listing assets, brand messaging, and launch campaign packs.</p>
          </div>
        ) : null}

        {activeTab === "Launch" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Launch</h3>
            <p className="text-sm text-gray-700">Coordinate Amazon, website, corporate, distributor, and retail launch channels.</p>
          </div>
        ) : null}

        {activeTab === "Sales" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Sales</h3>
            <p className="text-sm text-gray-700">Track orders, channel conversion, and returns by product project.</p>
          </div>
        ) : null}

        {activeTab === "Analytics" ? (
          <div className="space-y-3 p-2">
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-700">Monitor performance, customer feedback loops, and version-2 improvement readiness.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
