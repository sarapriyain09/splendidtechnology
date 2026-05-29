import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splendid Accounting | SME Accounting Software UK | Splendid Technology",
  description:
    "Splendid Accounting — purpose-built accounting software for UK SMEs and engineering businesses. Job costing, asset accounting, invoicing, VAT returns, and financial reporting.",
  keywords: [
    "sme accounting software uk",
    "engineering business accounting software",
    "job costing software uk",
    "asset accounting software uk",
    "vat accounting software uk",
    "splendid accounting",
    "small business accounting uk",
  ],
  alternates: { canonical: "/products/splendid-accounting" },
};

const features = [
  { icon: "📒", title: "Double-Entry Bookkeeping", desc: "Full double-entry accounting with automatic journal entries, trial balance, and account reconciliation." },
  { icon: "🔨", title: "Job Costing", desc: "Track costs and revenue per project or job. Know exactly which jobs are profitable and which aren't." },
  { icon: "🏗️", title: "Asset Accounting", desc: "Asset register, depreciation schedules, and disposal accounting — integrated with the balance sheet." },
  { icon: "📄", title: "Invoicing & Payments", desc: "Professional invoices, payment tracking, aged debtor reports, and automated payment reminders." },
  { icon: "🇬🇧", title: "VAT & MTD Compliance", desc: "MTD-ready VAT return preparation and submission — standard and flat-rate schemes supported." },
  { icon: "📊", title: "Financial Dashboards", desc: "Profit & loss, balance sheet, cash flow, and custom KPI dashboards — always up to date." },
];

export default function SplendidAccountingPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            Product — In Development
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Splendid Accounting
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">SME accounting software for engineering businesses</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Accounting software designed around how engineering and industrial businesses
            actually work — job costing, asset accounting, and VAT compliance, without the
            enterprise price tag or the learning curve.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Join the Waitlist
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Features</h2>
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
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Be first to know when we launch</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Splendid Accounting is in active development. Register your interest and we&apos;ll
            give you early access, a founding member discount, and input into the roadmap.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Register Interest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
