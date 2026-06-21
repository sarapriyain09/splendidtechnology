import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splendid ERP Light | Simple Business Management Software for UK SMEs",
  description:
    "Splendid ERP Light — affordable business management software for UK SMEs. CRM, quotations, invoicing, inventory, and procurement without the complexity of SAP or Oracle.",
  keywords: [
    "erp software for smes uk",
    "simple erp uk",
    "crm and invoicing software uk",
    "small business erp uk",
    "erp light uk",
    "quotation software uk sme",
    "inventory management software uk",
    "procurement software small business uk",
    "affordable erp uk",
    "business management software uk",
  ],
  alternates: { canonical: "/products/splendid-erp-light" },
};

const phase1Modules = [
  {
    priority: "1",
    icon: "🤝",
    title: "CRM & Sales",
    desc: "Manage leads, follow up with prospects, and track your entire sales pipeline from first contact to closed deal.",
  },
  {
    priority: "2",
    icon: "📄",
    title: "Quotations & Invoicing",
    desc: "Create professional quotes and invoices in minutes. Send, track, and convert — everything in one place.",
  },
  {
    priority: "3",
    icon: "👤",
    title: "Customer Management",
    desc: "A central contact database for all your customers, with full interaction history and document records.",
  },
  {
    priority: "4",
    icon: "🛒",
    title: "Procurement",
    desc: "Manage suppliers, raise purchase orders, and track deliveries without spreadsheets.",
  },
  {
    priority: "5",
    icon: "📦",
    title: "Inventory",
    desc: "Real-time stock control for trading and manufacturing businesses. Track SKUs, locations, and stock movements.",
  },
  {
    priority: "6",
    icon: "📊",
    title: "Dashboard",
    desc: "Sales pipeline, open tasks, revenue summary, and key business metrics on a single screen.",
  },
];

const targetCustomers = [
  "Engineering companies",
  "Electrical contractors",
  "Manufacturers",
  "Fabrication shops",
  "HVAC companies",
  "Maintenance companies",
  "Import / export businesses",
];

const roadmap = [
  {
    phase: "Phase 1",
    status: "Now",
    statusColor: "green",
    items: ["CRM & Leads", "Quotations", "Invoices", "Tasks", "Dashboard"],
  },
  {
    phase: "Phase 2",
    status: "Coming Soon",
    statusColor: "amber",
    items: ["Inventory", "Procurement", "Customer Portal", "Reporting"],
  },
  {
    phase: "Phase 3",
    status: "Planned",
    statusColor: "slate",
    items: ["Manufacturing", "BOM", "Work Orders", "Maintenance", "Quality"],
  },
  {
    phase: "Phase 4",
    status: "Future",
    statusColor: "slate",
    items: ["IoT Integration", "Motor Health Monitoring", "Predictive Maintenance", "Digital Twin"],
  },
];

const pricing = [
  {
    year: "Phase 1",
    label: "Starter",
    price: "£39",
    period: "/month",
    modules: ["CRM", "Quotations", "Invoicing", "Inventory"],
    highlight: false,
  },
  {
    year: "Phase 2",
    label: "Growth",
    price: "£99",
    period: "/month",
    modules: ["Everything in Starter", "Procurement", "Dashboards", "Reporting"],
    highlight: true,
  },
  {
    year: "Phase 3",
    label: "Manufacturing",
    price: "£299",
    period: "/month",
    modules: ["Everything in Growth", "Manufacturing", "BOM", "Industry 4.0"],
    highlight: false,
  },
];

const statusStyles: Record<string, string> = {
  green: "bg-green-500/10 text-green-700 border-green-500/30",
  amber: "bg-amber-400/10 text-amber-700 border-amber-400/30",
  slate: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function SplendidERPLightPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Product — Live
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Splendid ERP Light
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">
            Simple business management for UK SMEs
          </p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Not every business needs SAP. Splendid ERP Light gives UK small and medium businesses
            the tools they actually use — CRM, quotes, invoices, inventory, and procurement —
            without the enterprise complexity or price tag.
          </p>
          <blockquote className="mt-6 border-l-2 border-green-400 pl-4 text-white/70 italic">
            &ldquo;Simple ERP for growing businesses that don&apos;t need SAP complexity.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Request Early Access
            </Link>
            <Link
              href="https://erp.velynxia.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="bg-[#f7f7f7] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="overflow-hidden rounded-2xl border border-black/10 shadow-xl">
            <Image
              src="/images/projects/ERP.png"
              alt="Splendid ERP Light dashboard showing sales leads, inventory, and procurement modules"
              width={1280}
              height={720}
              className="w-full object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-center text-xs text-black/40">
            Splendid ERP Light — live dashboard at erp.velynxia.com
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Built for UK SMEs</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Most small businesses run on Excel spreadsheets, Outlook emails, and paper quotations.
            No CRM, poor follow-up, no visibility. Splendid ERP Light fixes that.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "📊", label: "Excel spreadsheets", fix: "Replace with live dashboards" },
              { icon: "📧", label: "Outlook emails", fix: "Centralise into CRM" },
              { icon: "🗒️", label: "Paper quotations", fix: "Digital quotes in minutes" },
              { icon: "❌", label: "No follow-up process", fix: "Automated task reminders" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-black/10 bg-white p-5">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-3 text-sm font-semibold text-black">{item.label}</p>
                <p className="mt-1 text-sm font-bold text-green-700">{item.fix}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-bold text-[#0b1f3a]">Target Industries</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {targetCustomers.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#0b1f3a]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase 1 Modules */}
      <section className="bg-[#f7f7f7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Phase 1 — Core Modules</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Everything you need to run your business</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Phase 1 focuses on what UK SMEs use every day. No bloated features — just what generates revenue and keeps operations running.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {phase1Modules.map((m) => (
              <div key={m.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b1f3a] text-xs font-bold text-white">
                    {m.priority}
                  </span>
                  <span className="text-2xl">{m.icon}</span>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{m.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Delayed to Phase 2+</p>
            <p className="mt-2 text-sm text-black/60">
              Full accounting · Payroll · HR · Manufacturing · MRP · Project management
            </p>
            <p className="mt-2 text-xs text-black/40">
              Most UK SMEs already use Xero or QuickBooks. Rather than compete, we will integrate with them in Phase 2.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Module Roadmap</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">From CRM to Industry 4.0</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            A clear growth path — start with CRM and invoicing today, grow into a full manufacturing and IoT platform tomorrow.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((r) => (
              <div key={r.phase} className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0b1f3a]">{r.phase}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[r.statusColor]}`}>
                    {r.status}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">›</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#0b1f3a] p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Long-term vision</p>
            <h3 className="mt-2 text-xl font-bold text-white">
              The affordable Industry 4.0 ERP for SMEs
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Phase 4 integrates with Splendid Monitor for real-time IoT data, motor health monitoring,
              and predictive maintenance — making Splendid ERP Light a complete smart manufacturing platform for SMEs.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/products/splendid-monitor"
                className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 hover:text-green-300"
              >
                Splendid Monitor &rarr;
              </Link>
              <Link
                href="/industrial-iot"
                className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white"
              >
                Industry 4.0 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#f7f7f7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Straightforward pricing</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Start small, scale as you grow. No long-term contracts, no hidden fees.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.year}
                className={`rounded-2xl border p-7 ${
                  p.highlight
                    ? "border-green-500 bg-[#0b1f3a] text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest ${p.highlight ? "text-green-400" : "text-black/40"}`}>
                  {p.year}
                </p>
                <p className={`mt-1 text-lg font-bold ${p.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {p.label}
                </p>
                <p className={`mt-3 text-3xl font-bold ${p.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {p.price}
                  <span className={`ml-1 text-sm font-normal ${p.highlight ? "text-white/60" : "text-black/40"}`}>
                    {p.period}
                  </span>
                </p>
                <ul className="mt-5 space-y-2">
                  {p.modules.map((m) => (
                    <li key={m} className={`flex items-start gap-2 text-sm ${p.highlight ? "text-white/80" : "text-black/70"}`}>
                      <span className="font-bold text-green-500">✔</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Get Started</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white">
            Ready to replace your spreadsheets?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60">
            Join the early access list. We are onboarding UK SMEs now — get in early and
            help shape the product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Request Early Access
            </Link>
            <Link
              href="https://erp.velynxia.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
