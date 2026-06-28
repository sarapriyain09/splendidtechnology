import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splendid Asset Manager | Asset Management & Engineering ERP Software UK",
  description:
    "Splendid Asset Manager — full asset lifecycle management and engineering ERP for UK businesses. Asset register, maintenance records, compliance tracking, performance analytics, and integration with Splendid Accounting.",
  keywords: [
    "asset management software uk",
    "engineering erp software uk",
    "asset lifecycle management uk",
    "maintenance management software uk",
    "splendid asset manager",
    "engineering asset software uk",
    "compliance tracking software uk",
  ],
  alternates: { canonical: "/products/splendid-asset-manager" },
};

const features = [
  { icon: "📋", title: "Asset Register", desc: "A complete register of every physical asset — location, specification, purchase date, warranty, and current condition." },
  { icon: "🔧", title: "Maintenance Records", desc: "Full maintenance history per asset — planned, corrective, and condition-based work. Always audit-ready." },
  { icon: "✅", title: "Compliance & Inspections", desc: "Schedule and log statutory inspections, safety checks, and compliance activities with full audit trails." },
  { icon: "📈", title: "Performance Analytics", desc: "OEE, uptime, failure frequency, and maintenance cost per asset — dashboards that drive decisions." },
  { icon: "📊", title: "Accounting Integration", desc: "Feeds directly into Splendid Accounting — asset depreciation, maintenance spend, and capital expenditure." },
  { icon: "📡", title: "IoT Integration", desc: "Connect to Splendid Monitor — sensor data updates asset health status and triggers maintenance records automatically." },
];

export default function SplendidAssetManagerPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-slate-400/20 bg-slate-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-slate-300">
            Product — Planned
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Splendid Asset Manager
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">Asset performance & engineering ERP</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Full asset lifecycle management for engineering and industrial businesses.
            From procurement to disposal — maintenance records, compliance tracking,
            performance analytics, and deep integration with your accounting system.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Register Interest
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Platform Features</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Interested in Splendid Asset Manager?</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            This product is in the planning phase. Register your interest to influence the
            roadmap, get early access pricing, and be first in line when we launch.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Register Interest
            </Link>
            <Link
              href="/services/software-development"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Custom Software Instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
