import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reliability Engineering Services UK | MTBF, FMEA, RAM | Velynxia",
  description:
    "Expert Reliability Engineering services for UK industry — MTBF analysis, FMEA/FMECA, RAM studies, RCM, and asset performance analytics. Evidence-based decisions for maintenance and engineering teams.",
  keywords: [
    "reliability engineering uk",
    "mtbf analysis uk",
    "fmea fmeca uk",
    "ram study uk",
    "rcm reliability centred maintenance uk",
    "asset performance analytics uk",
    "maintenance interval optimisation uk",
    "reliability engineering leicester",
  ],
  alternates: {
    canonical: "/services/reliability-engineering",
  },
};

const disciplines = [
  {
    icon: "⏱️",
    title: "MTBF Analysis",
    desc: "Calculate Mean Time Between Failures across your asset base. Identify worst performers and prioritise maintenance spend where it matters most.",
    bullets: ["Historical failure data analysis", "MTBF per asset and asset class", "Maintenance cost benchmarking", "Failure rate trending"],
  },
  {
    icon: "📋",
    title: "FMEA / FMECA",
    desc: "Failure Mode and Effects Analysis — systematic review of failure modes, their causes, and their impact on operations and safety.",
    bullets: ["Bottom-up failure mode identification", "Risk Priority Number (RPN) scoring", "Critical function mapping", "Mitigation recommendations"],
  },
  {
    icon: "📊",
    title: "RAM Studies",
    desc: "Reliability, Availability, and Maintainability analysis for new and existing systems — modelling plant availability and identifying bottlenecks.",
    bullets: ["System availability modelling", "Maintenance resource planning", "Redundancy analysis", "Production loss estimation"],
  },
  {
    icon: "🔄",
    title: "RCM — Reliability Centred Maintenance",
    desc: "A structured approach to developing maintenance strategies based on asset function, failure modes, and consequence of failure.",
    bullets: ["Maintenance task selection", "Interval optimisation", "Condition-based maintenance triggers", "Task rationalisation"],
  },
  {
    icon: "📈",
    title: "Asset Performance Analytics",
    desc: "Data-driven performance tracking for your critical assets. Trend analysis, KPI dashboards, and actionable insight from your maintenance records.",
    bullets: ["OEE and uptime tracking", "Failure cost analysis", "Maintenance KPI dashboards", "Long-term trend reporting"],
  },
  {
    icon: "⚙️",
    title: "Maintenance Interval Optimisation",
    desc: "Stop over-maintaining cheap assets and under-maintaining critical ones. Statistical optimisation of PM intervals based on actual failure data.",
    bullets: ["Weibull analysis", "Age-replacement modelling", "Cost-risk optimisation", "PM task review"],
  },
];

export default function ReliabilityEngineeringPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — Reliability Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Reliability Engineering Services
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Evidence-based reliability analysis for engineering and maintenance teams. MTBF,
            FMEA/FMECA, RAM studies, RCM, and asset performance analytics — giving you the
            data to make better decisions about your plant.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Request a Study
            </Link>
            <Link
              href="/tools/mtbf"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Try the MTBF Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Engineering Disciplines</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Delivered as consulting engagements or as part of our Splendid Reliability software platform.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {disciplines.map((d) => (
              <div key={d.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{d.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{d.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{d.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {d.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="font-bold text-green-600">✔</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product link */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Related Product</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Splendid Reliability — Software Platform</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              The Splendid Reliability platform automates MTBF calculations, tracks failures,
              and generates reliability reports — so your engineering team spends time on decisions,
              not spreadsheets.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products/splendid-reliability"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                View Splendid Reliability
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                Request a Consulting Study
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
