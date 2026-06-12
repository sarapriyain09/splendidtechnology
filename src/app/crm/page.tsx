import Link from "next/link";
import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.splendidtechnology.co.uk";

export const metadata: Metadata = {
  title: "Splendid CRM | CRM for Growing SMEs",
  description:
    "Splendid CRM helps growing SMEs manage leads, sales pipelines, quotes, and customer relationships in one practical system.",
  keywords: [
    "splendid crm",
    "crm for growing smes",
    "sales pipeline crm uk",
    "lead management software uk",
    "customer relationship management uk",
  ],
  alternates: {
    canonical: "/crm",
  },
  openGraph: {
    title: "Splendid CRM | CRM for Growing SMEs",
    description:
      "Lead management, sales pipeline visibility, quote workflows, and customer lifecycle tracking for SMEs.",
    url: "/crm",
    type: "website",
  },
};

const capabilities = [
  "Lead capture and qualification",
  "Pipeline and opportunity tracking",
  "Quote and proposal workflows",
  "Task, reminder, and follow-up automation",
  "Customer lifecycle and account timeline",
  "Sales dashboards and performance reporting",
];

const rolloutPlan = [
  {
    title: "Phase 1: CRM Foundation",
    body: "Set up your lead stages, pipeline views, and core sales process with clean data standards.",
  },
  {
    title: "Phase 2: Workflow Automation",
    body: "Automate follow-ups, assignment rules, quote approvals, and sales handoff workflows.",
  },
  {
    title: "Phase 3: Scale Into ERP Modules",
    body: "Extend into ERP, projects, inventory, and AI assistant modules with one login on a shared platform.",
  },
];

export default function CrmPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Splendid CRM
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            CRM for Growing SMEs
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Lead management, sales pipeline visibility, quote workflows, and customer relationship
            management designed for practical team adoption.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={appUrl}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Open CRM App
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Book a CRM Discovery Call
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What Splendid CRM Includes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item} className="rounded-xl border border-black/10 bg-white p-5">
                <p className="text-sm font-semibold text-[#0b1f3a]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Platform Vision</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
            Start with CRM as the entry product, then expand into ERP and operations modules on the
            same platform at <span className="font-semibold text-[#0b1f3a]">app.splendidtechnology.co.uk</span>.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {rolloutPlan.map((phase) => (
              <div key={phase.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{phase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 text-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Marketing Site + Product App</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-black/60">
            This page is your CRM marketing and positioning layer. The operational product experience
            lives in the dedicated application subdomain.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={appUrl}
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-7 py-3 font-bold text-white hover:bg-[#0e2a4f]"
            >
              Go to app.splendidtechnology.co.uk
            </a>
            <Link
              href="/services/sales-crm"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/20 px-7 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Explore CRM Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}