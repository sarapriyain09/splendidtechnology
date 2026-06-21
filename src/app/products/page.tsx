import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Velynxia products — Splendid Accounting, Splendid Reliability, Splendid Monitor, Splendid Asset Manager, and the Motor Health Monitoring Kit for industrial SMEs.",
  keywords: [
    "splendid accounting software",
    "splendid reliability software",
    "splendid monitor iot",
    "splendid asset manager",
    "sme accounting software uk",
    "industrial iot software uk",
    "reliability tracking software uk",
    "asset management software uk",
  ],
  alternates: {
    canonical: "/products",
  },
};

const products = [
  {
    icon: "�",
    label: "Free App",
    title: "ExpApp — Money Planner",
    tagline: "Free household budget & net worth tracker",
    description:
      "A free web app for managing your household finances. Track monthly income, expenses, and EMI repayments — and see your net worth at a glance. No subscription, no complexity, free forever.",
    status: "Free",
    statusColor: "green",
    bullets: [
      "Monthly budget planner",
      "Net worth tracker",
      "EMI & loan repayment tracking",
      "Monthly expense history",
      "Secure free accounts",
    ],
    href: "/products/expapp-money-planner",
    external: "https://expapp.co.uk",
  },
  {
    icon: "�📊",
    label: "Accounting",
    title: "Splendid Accounting",
    tagline: "SME accounting & finance software",
    description:
      "Purpose-built accounting software for small and medium-sized businesses, engineering firms, and industrial SMEs. Job costing, asset accounting, invoicing, and financial reporting — without the enterprise price tag.",
    status: "In Development",
    statusColor: "amber",
    bullets: [
      "Double-entry bookkeeping",
      "Job costing & project tracking",
      "Asset accounting & depreciation",
      "VAT returns & compliance",
      "Financial dashboards",
    ],
    href: "/products/splendid-accounting",
  },
  {
    icon: "⚙️",
    label: "Reliability",
    title: "Splendid Reliability",
    tagline: "MTBF calculations & reliability tracking",
    description:
      "Automate your reliability calculations. Track failures across motors, pumps, fans, and compressors. Calculate MTBF automatically and optimise maintenance intervals with evidence-based data.",
    status: "Early Access",
    statusColor: "green",
    bullets: [
      "Automated MTBF calculation",
      "Asset failure tracking",
      "Maintenance interval optimisation",
      "Reliability trend reporting",
      "FMEA support tools",
    ],
    href: "/products/splendid-reliability",
  },
  {
    icon: "🖥️",
    label: "IoT",
    title: "Splendid Monitor",
    tagline: "Industrial IoT dashboards & condition monitoring",
    description:
      "Real-time industrial IoT dashboards for motors, pumps, and rotating plant. Vibration analysis, energy monitoring, predictive alerts, and digital twins — connected to your physical assets.",
    status: "In Development",
    statusColor: "amber",
    bullets: [
      "Real-time asset health dashboards",
      "Vibration & current monitoring",
      "Energy consumption tracking",
      "Predictive maintenance alerts",
      "Digital twin models",
    ],
    href: "/products/splendid-monitor",
  },
  {
    icon: "�",
    label: "ERP",
    title: "Splendid ERP Light",
    tagline: "Simple business management for UK SMEs",
    description:
      "CRM, quotations, invoicing, inventory, and procurement in one place — without the complexity of SAP or Oracle. Built for engineering companies, manufacturers, contractors, and growing UK SMEs.",
    status: "Live",
    statusColor: "green",
    bullets: [
      "CRM & sales pipeline",
      "Quotations & invoicing",
      "Inventory & stock control",
      "Procurement & suppliers",
      "Live business dashboard",
    ],
    href: "/products/splendid-erp-light",
  },
  {
    icon: "🏗️",
    label: "Asset Management",
    title: "Splendid Asset Manager",
    tagline: "Asset performance & engineering ERP",
    description:
      "Full asset lifecycle management for engineering businesses. From procurement to disposal — maintenance records, compliance tracking, performance analytics, and integration with your accounting system.",
    status: "Planned",
    statusColor: "slate",
    bullets: [
      "Asset register & lifecycle tracking",
      "Maintenance history & records",
      "Compliance & inspection logging",
      "Performance analytics",
      "Integrates with Splendid Accounting",
    ],
    href: "/products/splendid-asset-manager",
  },
  {
    icon: "🔧",
    label: "Hardware",
    title: "Motor Health Monitoring Kit",
    tagline: "Portable motor diagnostic kit for industrial SMEs",
    description:
      "A portable, affordable diagnostic kit for assessing the health of industrial motors, pumps, fans, and rotating machinery — without a permanent installation. Vibration analysis, current signature, temperature, and insulation health in one kit.",
    status: "In Development",
    statusColor: "amber",
    bullets: [
      "Vibration analysis (FFT)",
      "Current Signature Analysis (MCSA)",
      "Temperature monitoring",
      "Insulation health indicator",
      "Portable dashboard & auto-reports",
    ],
    href: "/products/motor-health-monitoring-kit",
  },
];

const statusStyles: Record<string, string> = {
  green: "bg-green-500/10 text-green-700 border-green-500/30",
  amber: "bg-amber-400/10 text-amber-700 border-amber-400/30",
  slate: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ProductsPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Velynxia — Products
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Software Products Built for Real People and Engineering Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            From a free household budget planner to industrial IoT dashboards — our products
            cover personal finance, accounting, reliability engineering, and asset management.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Join Early Access
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Our Product Suite</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            ExpApp is free and live today. Our engineering products integrate with each other — accounting connects to asset management, reliability connects to IoT monitoring.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {products.map((p) => (
              <div key={p.title} className="flex flex-col rounded-2xl border border-black/10 bg-white p-7">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[p.statusColor]}`}>
                      {p.status}
                    </span>
                    <span className="rounded-full bg-[#0b1f3a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/60">
                      {p.label}
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#0b1f3a]">{p.title}</h3>
                <p className="mt-0.5 text-xs font-medium text-black/40">{p.tagline}</p>
                <p className="mt-3 text-sm leading-6 text-black/60 flex-1">{p.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="font-bold text-green-600">✔</span> {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0b1f3a] hover:text-green-700"
                >
                  Learn more &rarr;
                </Link>
                {"external" in p && (
                  <a
                    href={(p as { external: string }).external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
                  >
                    Open App &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration note */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Built to Work Together</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white">
            An integrated suite for engineering businesses
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60">
            Splendid Accounting feeds into Splendid Asset Manager. Splendid Monitor feeds into
            Splendid Reliability. A connected platform, not isolated tools.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
