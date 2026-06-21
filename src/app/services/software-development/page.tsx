import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Development Services UK | Custom Business Software | Velynxia",
  description:
    "Custom software development for UK businesses — accounting systems, asset management, ERP modules, workflow automation, and data reporting tools. Built around how your business works.",
  keywords: [
    "custom software development uk",
    "business software development uk",
    "accounting software development uk",
    "asset management software uk",
    "erp development uk",
    "workflow automation software uk",
    "bespoke software development leicester",
    "sme software development uk",
  ],
  alternates: {
    canonical: "/services/software-development",
  },
};

const areas = [
  {
    icon: "📊",
    title: "Accounting & Finance Software",
    desc: "Purpose-built accounting and finance systems for SMEs — job costing, asset accounting, invoicing, and reporting tailored to your business model.",
  },
  {
    icon: "🏗️",
    title: "Asset Management Systems",
    desc: "Track and manage physical assets across their entire lifecycle — from purchase to disposal. Maintenance records, depreciation, and compliance built in.",
  },
  {
    icon: "🔄",
    title: "ERP Modules & Integrations",
    desc: "Custom ERP modules that fill gaps in your existing system, or full lightweight ERP builds for engineering and manufacturing businesses.",
  },
  {
    icon: "⚡",
    title: "Workflow Automation Tools",
    desc: "Automate repetitive business processes — approvals, notifications, data entry, reporting, and cross-system data sync.",
  },
  {
    icon: "📈",
    title: "Data Reporting & Analytics",
    desc: "Custom dashboards and reports that pull from your data sources — giving management the insight they need without manual spreadsheet work.",
  },
  {
    icon: "🔐",
    title: "Compliance & Audit Tools",
    desc: "Software built for regulated industries — audit trails, document control, approval workflows, and compliance reporting.",
  },
];

export default function SoftwareDevelopmentPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — Software Development
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Custom Software Development
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Off-the-shelf software rarely fits. We build custom business software around
            how your company actually works — accounting, asset management, ERP modules,
            workflow automation, and data tools for UK SMEs and industrial businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Discuss Your Requirements
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Our Products
            </Link>
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Build</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Software that engineering, operations, and finance teams actually want to use.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <div key={a.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{a.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products link */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Or Start with One of Our Products</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            We&apos;ve already built proven software products for accounting, reliability, and
            asset monitoring. Start with a product and customise, or commission a bespoke build.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/products/splendid-accounting", label: "Splendid Accounting", desc: "SME accounting software" },
              { href: "/products/splendid-reliability", label: "Splendid Reliability", desc: "MTBF & reliability tracking" },
              { href: "/products/splendid-monitor", label: "Splendid Monitor", desc: "IoT dashboards" },
              { href: "/products/splendid-asset-manager", label: "Splendid Asset Manager", desc: "Asset & ERP" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-xl border border-black/10 bg-white p-5 hover:bg-black/[.02]"
              >
                <p className="font-semibold text-[#0b1f3a]">{p.label}</p>
                <p className="mt-1 text-xs text-black/50">{p.desc}</p>
                <span className="mt-3 block text-xs font-semibold text-green-700">View product &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="mx-auto w-full max-w-xl px-4">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Ready to replace your spreadsheets?</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Let&apos;s talk about what you need built, your timeline, and the budget. We&apos;ll tell
            you honestly whether a product or bespoke build is the better fit.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Start the Conversation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
