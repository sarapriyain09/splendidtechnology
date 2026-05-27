import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business Process Automation for Industrial Operations | UK",
  description:
    "Splendid Technology delivers AI-powered business process automation for UK manufacturers and industrial SMEs — maintenance reporting, work order automation, operational dashboards, and intelligent workflow tools.",
  keywords: [
    "ai business process automation uk",
    "industrial process automation uk",
    "maintenance reporting automation uk",
    "operational dashboard software uk",
    "work order automation uk",
    "ai workflow automation manufacturers uk",
    "business process improvement uk manufacturers",
    "digital operations management uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const automationServices = [
  {
    icon: "📋",
    title: "Automated Maintenance Reporting",
    description:
      "Eliminate manual report writing. AI captures data from your monitoring systems and generates structured maintenance reports automatically — ready for your team before the shift ends.",
    bullets: [
      "Auto-generated shift and daily reports",
      "Connected to IoT sensor data",
      "Email and dashboard delivery",
      "PDF export for compliance records",
    ],
  },
  {
    icon: "📅",
    title: "Work Order & Scheduling Automation",
    description:
      "When a sensor flags an anomaly, a work order is created automatically. No manual entry, no delays — the right technician gets the right job at the right time.",
    bullets: [
      "Trigger-based work order creation",
      "Priority scoring by severity",
      "Technician assignment & notification",
      "Integration with maintenance calendars",
    ],
  },
  {
    icon: "📈",
    title: "Operational KPI Dashboards",
    description:
      "A single pane of glass for your operations. Live dashboards show uptime, fault trends, maintenance costs, and team performance — giving management real data to make real decisions.",
    bullets: [
      "Live uptime and downtime tracking",
      "Maintenance cost analysis",
      "Asset health trending over time",
      "Role-based views for management vs. engineers",
    ],
  },
  {
    icon: "📱",
    title: "Digital Data Capture & Forms",
    description:
      "Replace paper inspection sheets and manual data entry with smart digital forms. Data flows directly into your systems — accurate, immediate, and searchable.",
    bullets: [
      "Mobile-first inspection forms",
      "Photo and signature capture",
      "Auto-sync to central database",
      "Instant audit trail & compliance logging",
    ],
  },
  {
    icon: "🔔",
    title: "Smart Alerting & Escalation",
    description:
      "The right alert, to the right person, at the right time. Configurable thresholds trigger notifications across SMS, email, or your existing systems — with escalation rules if issues go unresolved.",
    bullets: [
      "Multi-channel alert delivery",
      "Configurable severity thresholds",
      "Escalation chains if unacknowledged",
      "Integrated with IoT sensor data",
    ],
  },
  {
    icon: "🔄",
    title: "Workflow & Process Integration",
    description:
      "Connect your monitoring systems, ERP, and operational tools into one automated workflow. Reduce data silos, remove double entry, and keep every system in sync.",
    bullets: [
      "n8n and API-based integrations",
      "ERP and CMMS connectivity",
      "Automated data validation",
      "Custom workflow design",
    ],
  },
];

const useCases = [
  { label: "Automated fault-to-work-order in under 60 seconds" },
  { label: "Shift handover reports generated while engineers are still on-site" },
  { label: "Management receives daily plant health summary every morning at 7am" },
  { label: "Inspection teams capture data on mobile — no paperwork, no re-entry" },
  { label: "Finance receives automated monthly maintenance cost reports" },
];

export default function ServicesPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
            Business Process Improvement
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            AI Business Process Automation
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Beyond monitoring hardware — we automate the business processes around your
            industrial operations. Reporting, work orders, dashboards, and data capture.
            All connected. All automated.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/industrial-iot"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              See Our IoT Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Automation Services Grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Automate</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Every automation we build is designed to remove manual bottlenecks from your
            industrial operations — saving time, reducing errors, and giving your team
            better data.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {automationServices.map((s) => (
              <div key={s.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-[#0b1f3a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{s.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">✔</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Real-World Use Cases</h2>
          <p className="mt-2 text-sm text-black/60">What our automation looks like in practice on the plant floor:</p>
          <ul className="mt-6 space-y-3">
            {useCases.map((u) => (
              <li key={u.label} className="flex items-start gap-3 rounded-xl border border-black/10 bg-white px-5 py-4">
                <span className="mt-0.5 text-green-600 font-bold text-lg">→</span>
                <span className="text-sm leading-6 text-black/70">{u.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Connected to IoT */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-green-400">Better Together</p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Paired with Industrial IoT Monitoring
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Our AI automation services are most powerful when connected to our
                  industrial IoT monitoring solutions. Sensor data drives automated
                  reports, alerts trigger automated work orders, and dashboards show the
                  complete picture — from motor health to maintenance cost.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/industrial-iot"
                    className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
                  >
                    Explore Industrial IoT
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                  >
                    Book a Free Consultation
                  </Link>
                </div>
              </div>
              <div className="grid w-full max-w-xs grid-cols-1 gap-3 lg:w-auto">
                {[
                  "Smart Motor Monitoring",
                  "Predictive Maintenance",
                  "Portable Diagnostic Kit",
                  "Industry 4.0 Solutions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                    <span className="text-green-400 font-bold">→</span>
                    <span className="text-sm font-medium text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f7f7] py-14 text-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Ready to Automate Your Operations?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
            We start with a discovery call to understand your current processes, then
            design and build automation that fits your operation — not a generic template.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/industrial-iot"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              See Our IoT Solutions
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
