import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predictive Maintenance Solutions | Velynxia Industrial IoT",
  description:
    "Replace reactive repairs with planned, data-driven maintenance. Splendid Technology builds predictive maintenance systems for UK manufacturers and industrial SMEs.",
  keywords: [
    "predictive maintenance uk",
    "condition-based maintenance uk",
    "industrial predictive maintenance sme",
    "equipment failure prediction uk",
    "planned maintenance iot uk",
    "reduce maintenance costs uk manufacturer",
  ],
  alternates: {
    canonical: "/industrial-iot/predictive-maintenance",
  },
};

const comparisons = [
  {
    type: "Reactive Maintenance",
    label: "What you may be doing now",
    bad: true,
    points: [
      "Equipment fails without warning",
      "Emergency callouts at peak rates",
      "Production halted while waiting for parts",
      "Unplanned overtime and knock-on costs",
      "No data — just guesswork",
    ],
  },
  {
    type: "Predictive Maintenance",
    label: "What we help you achieve",
    bad: false,
    points: [
      "Faults detected weeks before failure",
      "Planned servicing at convenient times",
      "Parts ordered in advance, no downtime delay",
      "Reduced overtime and emergency spend",
      "Data-driven decisions for every asset",
    ],
  },
];

const capabilities = [
  {
    title: "Continuous Condition Monitoring",
    description:
      "Sensors track vibration, temperature, current, and other parameters around the clock — building a picture of each asset's health over time.",
  },
  {
    title: "Anomaly Detection",
    description:
      "When readings deviate from established baselines, the system flags potential issues automatically — giving your team early, actionable warning.",
  },
  {
    title: "Maintenance Scheduling Integration",
    description:
      "Alerts can be linked to your existing maintenance workflow or ticketing system, so nothing gets missed.",
  },
  {
    title: "Cost Tracking & ROI Reporting",
    description:
      "Track how many failures were avoided and what that saved you — building the business case for wider deployment.",
  },
];

const assets = [
  "Electric motors",
  "Pumps & compressors",
  "Conveyor systems",
  "HVAC units",
  "Fans & blowers",
  "Gearboxes & drives",
];

export default function PredictiveMaintenancePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-xs text-black/50">
        <Link href="/industrial-iot" className="hover:text-[#0b3d91]">
          Industrial IoT
        </Link>
        <span>/</span>
        <span>Predictive Maintenance</span>
      </nav>

      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-[#0b3d91]">
          Industrial IoT — Service
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Predictive Maintenance
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Stop waiting for equipment to break. Predictive maintenance uses real-time
          data from your assets to tell you when servicing is needed — before a failure
          costs you production time and money.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
          >
            Discuss your maintenance challenges
          </Link>
        </div>
      </header>

      {/* Dashboard image */}
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <Image
          src="/images/industrial-iot/predictive maintennce.png"
          alt="Predictive Maintenance dashboard — showing motor health score, temperature, vibration, current trends, alerts and next maintenance prediction"
          width={1200}
          height={800}
          className="w-full"
          priority
        />
      </section>

      {/* Comparison */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Reactive vs. Predictive Maintenance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {comparisons.map((col) => (
            <div
              key={col.type}
              className={`rounded-2xl border p-6 ${col.bad ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}`}
            >
              <p
                className={`mb-1 text-xs font-medium uppercase tracking-wider ${col.bad ? "text-red-600" : "text-green-700"}`}
              >
                {col.label}
              </p>
              <h3 className="mb-3 font-semibold">{col.type}</h3>
              <ul className="space-y-2">
                {col.points.map((point) => (
                  <li
                    key={point}
                    className={`flex items-start gap-2 text-sm ${col.bad ? "text-red-800/80" : "text-green-900/80"}`}
                  >
                    <span className="mt-0.5">{col.bad ? "✗" : "✓"}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What we provide */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What We Provide</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <h3 className="font-semibold">{cap.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Assets covered */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Assets We Can Monitor</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Our solutions are designed around your specific equipment. Common assets
          include:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <li key={asset} className="flex items-center gap-2 text-sm text-black/70">
              <span className="text-[#0b3d91]">→</span>
              {asset}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-black/60">
          Don&apos;t see your equipment listed? Contact us — if it has a measurable
          characteristic, we can monitor it.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-[#0b3d91]/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Ready to Reduce Downtime?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
          We start with a discovery call to understand your equipment, failure history,
          and maintenance costs. From there we design a pilot that proves the value
          before you scale.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
          >
            Get in touch →
          </Link>
          <Link
            href="/industrial-iot/smart-motor-monitoring"
            className="inline-block rounded-lg border border-[#0b3d91] px-5 py-2.5 text-sm font-medium text-[#0b3d91] hover:bg-[#0b3d91]/5"
          >
            See Smart Motor Monitoring
          </Link>
        </div>
      </section>

      <div>
        <Link href="/industrial-iot" className="text-sm text-[#0b3d91] hover:underline">
          ← Back to Industrial IoT
        </Link>
      </div>
    </div>
  );
}
