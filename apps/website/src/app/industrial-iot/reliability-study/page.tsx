import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motor Reliability Study Service | Velynxia UK",
  description:
    "On-site motor reliability studies for UK manufacturing and industrial SMEs. We assess your equipment, identify failure risks, and give you a clear, actionable reliability improvement plan.",
  keywords: [
    "motor reliability study uk",
    "motor reliability assessment uk",
    "equipment reliability audit uk",
    "maintenance optimisation uk sme",
    "motor condition assessment uk",
    "reliability consulting uk",
    "motor mtbf assessment uk",
  ],
  alternates: {
    canonical: "/industrial-iot/reliability-study",
  },
  openGraph: {
    title: "Motor Reliability Study Service | Velynxia UK",
    description:
      "On-site assessment of your motor fleet — failure risk ranking, condition data, MTBF baseline, and a practical reliability improvement plan.",
  },
};

/* ── Data ─────────────────────────────────────────────────────────── */

const assetTypes = [
  { icon: "⚙️", label: "Electric Motors" },
  { icon: "💧", label: "Pumps & Compressors" },
  { icon: "🌀", label: "Fans & Blowers" },
  { icon: "📦", label: "Conveyor Systems" },
  { icon: "🌡️", label: "HVAC Units" },
  { icon: "⚡", label: "Gearboxes & Drives" },
  { icon: "🔩", label: "Rotating Machinery" },
  { icon: "🏭", label: "Production Line Systems" },
];

const whatIsIncluded = [
  {
    icon: "📡",
    title: "On-Site Condition Assessment",
    description:
      "We bring our portable diagnostic kit to your site and capture vibration, temperature, and current readings from every asset in scope — non-invasive, no production shutdown required.",
  },
  {
    icon: "⚙️",
    title: "Failure Mode Identification",
    description:
      "Each system is assessed against the failure modes relevant to its type — bearing degradation, overheating, imbalance, electrical issues, lubrication failure, and more.",
  },
  {
    icon: "⏱️",
    title: "MTBF Baseline Establishment",
    description:
      "Using your existing maintenance records and our condition data, we establish a starting MTBF baseline per asset — giving you a reference point for measuring future improvement.",
  },
  {
    icon: "⚠️",
    title: "Asset Criticality Ranking",
    description:
      "Every system is scored by production impact and current condition. You receive a prioritised list of which assets carry the most risk to your operations right now.",
  },
  {
    icon: "📋",
    title: "Detailed Findings Report",
    description:
      "A structured written report covering every assessed system — condition status, identified anomalies, risk level, and recommended actions. Clear for engineers; digestible for management.",
  },
  {
    icon: "🗺️",
    title: "Reliability Improvement Roadmap",
    description:
      "A phased action plan: what to address immediately, what to monitor closely, and what can be deferred. Prioritised by risk and cost-effectiveness.",
  },
];

const studyProcess = [
  {
    step: "1",
    title: "Scoping Call",
    description:
      "We discuss your site, asset list, maintenance history, and the problems you are trying to solve. No obligation — just a clear view of whether a study is the right starting point.",
  },
  {
    step: "2",
    title: "Site Visit & Data Capture",
    description:
      "Our engineer visits your site with the portable diagnostic kit. We assess each system in scope, capturing vibration, temperature, and current data. Typically one day per site.",
  },
  {
    step: "3",
    title: "Analysis & Report",
    description:
      "We analyse the captured data against known failure signatures for each asset type, cross-reference with your maintenance records, and produce your findings report and criticality ranking.",
  },
  {
    step: "4",
    title: "Findings Presentation",
    description:
      "We walk through the report with your team — explaining every finding, answering questions, and agreeing on the recommended next steps.",
  },
  {
    step: "5",
    title: "Ongoing Support (Optional)",
    description:
      "If continuous monitoring is recommended for specific assets, we can deploy our Smart Motor Monitoring system or schedule follow-up assessments as part of a maintenance contract.",
  },
];

const whoNeedsThis = [
  {
    situation: "You have no condition data on your systems",
    detail:
      "Running critical equipment with no health data is a high-risk position. A reliability study gives you an immediate baseline — so future decisions are evidence-based, not reactive.",
  },
  {
    situation: "You have had unexpected failures recently",
    detail:
      "One unplanned failure is a warning. A study identifies which other assets carry similar risk and what patterns tend to precede that type of failure.",
  },
  {
    situation: "You are planning a maintenance budget",
    detail:
      "A criticality-ranked asset list tells you where to invest first. Avoid over-maintaining low-risk systems and under-maintaining the ones that matter most.",
  },
  {
    situation: "You are starting a predictive maintenance programme",
    detail:
      "A reliability study is the natural starting point — it defines which assets warrant continuous monitoring and what thresholds make sense for each one.",
  },
];

const deliverables = [
  "Per-asset condition summary (vibration, temperature, current where applicable)",
  "Failure mode assessment relevant to each asset type",
  "MTBF baseline derived from maintenance history",
  "Asset criticality ranking (High / Medium / Low)",
  "Prioritised risk register",
  "Maintenance interval recommendations",
  "Phased reliability improvement roadmap",
  "Written findings report (PDF)",
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function ReliabilityStudyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <nav className="flex gap-2 text-xs text-black/50">
        <Link href="/industrial-iot" className="hover:text-[#0b3d91]">
          Industrial IoT
        </Link>
        <span>/</span>
        <span>Reliability Study</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-[#0b3d91]">
          Engineering Service
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Industrial Reliability Study
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          A structured, on-site assessment of the critical systems in your facility —
          motors, pumps, fans, compressors, conveyors, HVAC, and more. We capture
          condition data, rank assets by failure risk, establish your MTBF baseline,
          and give you a practical improvement plan.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
          >
            Request a Study
          </Link>
          <Link
            href="/industrial-iot/portable-diagnostic-kit"
            className="inline-block rounded-lg border border-[#0b3d91] px-5 py-2.5 text-sm font-medium text-[#0b3d91] hover:bg-[#0b3d91]/5"
          >
            About the Diagnostic Kit →
          </Link>
        </div>
      </header>

      {/* Asset types */}
      <section className="rounded-2xl bg-[#0b1f3a] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Systems We Assess</h2>
        <p className="mt-2 text-sm text-white/55">
          A reliability study is not limited to motors. Any rotating or mechanical system
          that affects your operations can be included in scope.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {assetTypes.map((a) => (
            <div key={a.label} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <span className="text-xl">{a.icon}</span>
              <span className="text-sm font-medium text-white/80">{a.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What is included */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What the Study Covers</h2>
        <p className="max-w-2xl text-sm leading-6 text-black/60">
          Every reliability study follows the same structured scope — adapted to the
          number of assets and your site&rsquo;s maintenance context.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whatIsIncluded.map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-5">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">What You Receive</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          At the end of every study your team receives a complete, actionable document set — not a generic template.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-black/70">
              <span className="mt-0.5 flex-shrink-0 text-green-600">✓</span>
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
        <div className="space-y-3">
          {studyProcess.map((s) => (
            <div key={s.step} className="flex gap-5 rounded-2xl border border-black/10 bg-white p-5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-sm font-bold text-white">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-6 text-black/60">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who needs this */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Who This Is For</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {whoNeedsThis.map((w) => (
            <div key={w.situation} className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="font-semibold text-[#0b1f3a]">&ldquo;{w.situation}&rdquo;</p>
              <p className="mt-2 text-sm leading-6 text-black/60">{w.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-2xl border border-black/10 bg-[#f7f8fa] p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Pricing</h2>
        <p className="mt-3 text-sm leading-6 text-black/65">
          Reliability study pricing depends on the number of systems in scope, site
          location, and the complexity of your maintenance history. We quote on a
          per-engagement basis after the scoping call — so you know the full cost
          before any commitment.
        </p>
        <p className="mt-3 text-sm leading-6 text-black/65">
          Typical studies are delivered as a fixed-fee engineering engagement.
          Contact us to discuss your site and receive a quote.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
        >
          Request a Quote
        </Link>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-[#0b1f3a] p-8 sm:p-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-bold text-white">
            Ready to understand your system reliability?
          </h2>
          <p className="text-sm leading-7 text-white/70">
            A reliability study is the clearest way to move from reactive guesswork to
            evidence-based maintenance — without committing to a full monitoring
            deployment upfront. It works for any industrial system, any sector.
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              Book a Scoping Call
            </Link>
            <Link
              href="/industrial-iot/predictive-maintenance"
              className="inline-block rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Predictive Maintenance →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
