import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MTBF Calculator & Reliability Tool | Splendid Technology — Launching Soon",
  description:
    "A purpose-built MTBF (Mean Time Between Failures) tool for UK industrial SMEs. Track failure history, calculate reliability metrics, and optimise maintenance intervals — all in one platform.",
  keywords: [
    "mtbf calculator uk",
    "mean time between failures tool uk",
    "reliability software uk sme",
    "maintenance interval calculator uk",
    "equipment reliability tracking uk",
    "mtbf software industrial uk",
    "asset reliability dashboard uk",
  ],
  alternates: {
    canonical: "/tools/mtbf",
  },
  openGraph: {
    title: "MTBF Tool — Launching Soon | Splendid Technology",
    description:
      "Track failure history, calculate MTBF, and optimise your maintenance intervals. Built for UK manufacturing and industrial SMEs.",
  },
};

/* ── Data ─────────────────────────────────────────────────────────── */

const plannedFeatures = [
  {
    icon: "⏱️",
    title: "Automated MTBF Calculation",
    description:
      "Log failures and let the system calculate MTBF, MTTF, and MTTR automatically — per asset, per asset class, or across your whole site.",
  },
  {
    icon: "📋",
    title: "Failure Event Logging",
    description:
      "Record every failure event — cause, duration, severity, repair cost. Build a structured failure history your maintenance team can actually learn from.",
  },
  {
    icon: "📊",
    title: "Reliability Dashboard",
    description:
      "A live view of your most critical assets ranked by reliability score, failure frequency, and maintenance cost. Know where the risk sits at a glance.",
  },
  {
    icon: "🔔",
    title: "Maintenance Interval Optimisation",
    description:
      "Based on historical MTBF trends, the tool recommends inspection intervals — reducing over-maintenance and eliminating under-maintenance.",
  },
  {
    icon: "⚠️",
    title: "Asset Criticality Scoring",
    description:
      "Assign criticality ratings to every asset. The tool weights your MTBF data against production impact — so you prioritise the right equipment first.",
  },
  {
    icon: "📈",
    title: "Trend Analysis & Reporting",
    description:
      "Track how MTBF evolves over time. Generate monthly reliability reports to demonstrate improvement, justify spend, and support audits.",
  },
  {
    icon: "🔗",
    title: "Sensor Data Integration",
    description:
      "Connect directly to your Smart Motor Monitoring sensors. Failure events can be automatically logged when condition thresholds are breached.",
  },
  {
    icon: "🏭",
    title: "Multi-Site & Multi-Asset",
    description:
      "Manage assets across multiple sites from a single account. Group by department, site, or asset class — the structure fits your operation.",
  },
];

const whoIsItFor = [
  { label: "Maintenance Managers", detail: "Structured, data-driven reliability tracking — no spreadsheets." },
  { label: "Plant Engineers", detail: "Log failures quickly, see real MTBF and trends per asset." },
  { label: "Reliability Engineers", detail: "Full MTBF/MTTR/MTTF metrics with failure mode breakdown." },
  { label: "Operations Managers", detail: "Cost of failure visibility — justified maintenance investment." },
  { label: "Safety & Compliance Teams", detail: "Audit-ready failure history and maintenance interval records." },
];

const metrics = [
  { term: "MTBF", full: "Mean Time Between Failures", description: "Average time a repairable asset operates between failures. The core metric for reliability planning." },
  { term: "MTTF", full: "Mean Time To Failure", description: "Average time a non-repairable asset operates before its first — and only — failure." },
  { term: "MTTR", full: "Mean Time To Repair", description: "Average time taken to restore an asset to full operation after a failure. A key measure of maintenance efficiency." },
  { term: "Availability", full: "Operational Availability", description: "The proportion of time an asset is in a state to perform its function. Derived from MTBF and MTTR." },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    unit: "during beta",
    description: "For single-site teams getting started with reliability tracking.",
    features: ["Up to 10 assets", "MTBF & MTTR calculations", "Failure event log", "Basic dashboard"],
    highlight: false,
    cta: "Join the Beta Waitlist",
  },
  {
    name: "Professional",
    price: "£49",
    unit: "per month",
    description: "For maintenance teams that need full analytics and reporting.",
    features: [
      "Unlimited assets",
      "MTBF / MTTR / MTTF / Availability",
      "Asset criticality scoring",
      "Maintenance interval optimisation",
      "Monthly reliability reports",
      "Sensor data integration",
    ],
    highlight: true,
    cta: "Join the Beta Waitlist",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "contact us",
    description: "Multi-site deployments with custom integrations and SLA support.",
    features: [
      "Everything in Professional",
      "Multi-site fleet view",
      "API & CMMS integrations",
      "White-label reporting",
      "Dedicated support",
    ],
    highlight: false,
    cta: "Talk to Us",
  },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function MtbfToolPage() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="mb-6 flex gap-2 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-amber-400">MTBF Tool</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                Launching Soon
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                Reliability Software
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              MTBF Tool — Reliability Tracking for Industrial SMEs
            </h1>

            <p className="max-w-2xl text-lg leading-7 text-white/70">
              Know exactly how reliable your equipment is. Log failure events, calculate
              MTBF automatically, and optimise maintenance intervals — without spreadsheets.
            </p>

            <p className="text-sm text-white/50">
              Built for UK manufacturing and industrial maintenance teams. Launching soon — join the waitlist to get early access.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-7 py-3 font-bold text-white transition-colors hover:bg-amber-600"
              >
                Join the Early Access Waitlist
              </Link>
              <Link
                href="/industrial-iot/smart-motor-monitoring"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                See Our Monitoring Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is MTBF strip ── */}
      <section className="border-b border-black/10 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">The Three Metrics That Define Reliability</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
            Most UK industrial SMEs track downtime in their heads — or on a whiteboard. This tool
            turns that into structured, actionable reliability intelligence.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.term} className="rounded-2xl border border-black/10 bg-[#f7f8fa] p-5">
                <p className="text-2xl font-bold text-[#0b3d91]">{m.term}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/40">{m.full}</p>
                <p className="mt-3 text-sm leading-6 text-black/65">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planned features ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What the Tool Will Do</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Every feature is designed around one goal: give maintenance teams a clear, accurate
            picture of equipment reliability — without the complexity of enterprise CMMS systems.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plannedFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Who It&rsquo;s Built For</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-black/60">
            Designed for the people who actually live with maintenance data — not IT departments.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {whoIsItFor.map((w) => (
              <div key={w.label} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-black/10">
                <span className="mt-0.5 flex-shrink-0 text-green-600">✓</span>
                <div>
                  <p className="font-semibold text-[#0b1f3a]">{w.label}</p>
                  <p className="mt-0.5 text-sm text-black/60">{w.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Planned Pricing</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
            Affordable from day one. Beta access is free — and early joiners receive discounted pricing at launch.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-[#0b3d91] bg-[#0b1f3a] text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 inline-block self-start rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-green-400">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xs ${plan.highlight ? "text-white/50" : "text-black/40"}`}>
                    {plan.unit}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlight ? "text-white/60" : "text-black/60"}`}>
                  {plan.description}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-white/70" : "text-black/65"}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-green-400" : "text-green-600"}`}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border border-[#0b3d91] text-[#0b3d91] hover:bg-[#0b3d91]/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integration callout ── */}
      <section className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-2xl border border-[#0b3d91]/20 bg-[#0b3d91]/5 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0b3d91]">Better Together</p>
                <h3 className="text-xl font-bold text-[#0b1f3a]">
                  Pair the MTBF Tool with Smart Motor Monitoring
                </h3>
                <p className="text-sm leading-6 text-black/65">
                  When your sensors detect a fault, the MTBF tool automatically logs the failure event.
                  No manual entry. Your reliability metrics update in real time — giving you the most
                  accurate MTBF picture possible.
                </p>
              </div>
              <Link
                href="/industrial-iot/smart-motor-monitoring"
                className="inline-block flex-shrink-0 rounded-lg bg-[#0b3d91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#092f72]"
              >
                See Smart Motor Monitoring →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 sm:p-12">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                Early Access
              </span>
              <h2 className="text-3xl font-bold text-white">
                Be first to use the MTBF Tool
              </h2>
              <p className="text-sm leading-7 text-white/65">
                We&rsquo;re opening early access to a small group of UK manufacturing and maintenance
                teams. Early users help shape the product — and receive preferential pricing at launch.
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/contact"
                  className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600"
                >
                  Join the Waitlist
                </Link>
                <Link
                  href="/industrial-iot"
                  className="inline-block rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  Explore All Solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
