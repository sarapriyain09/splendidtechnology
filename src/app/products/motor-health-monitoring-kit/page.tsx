import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motor Health Monitoring Kit | Splendid Technology",
  description:
    "A portable, affordable motor health monitoring kit for industrial SMEs. Measure vibration, current signature, temperature, and insulation health — without a permanent installation.",
  alternates: {
    canonical: "/products/motor-health-monitoring-kit",
  },
};

const features = [
  {
    title: "Vibration Analysis (FFT)",
    desc: "Capture vibration signatures in the time and frequency domain. Detect bearing faults, imbalance, misalignment, and looseness before they cause failure.",
    items: ["Broadband vibration measurement", "FFT spectrum analysis", "Fault frequency identification", "Trend logging over time"],
  },
  {
    title: "Current Signature Analysis (CSA)",
    desc: "Measure motor current to detect rotor bar faults, air-gap eccentricity, and other electrical faults — no physical access to the motor required.",
    items: ["Non-invasive clamp-on measurement", "Motor Current Signature Analysis (MCSA)", "Rotor fault detection", "Load variation analysis"],
  },
  {
    title: "Temperature Monitoring",
    desc: "Monitor winding temperature, bearing temperature, and ambient conditions using non-contact and contact sensors.",
    items: ["Winding & bearing temperature", "Infrared non-contact measurement", "Thermal trending", "Overtemperature alerts"],
  },
  {
    title: "Insulation Health Indicator",
    desc: "Assess the health of winding insulation without a full motor shutdown. Early detection of insulation degradation extends motor life.",
    items: ["Insulation resistance trending", "Polarisation index (PI) monitoring", "Early degradation warnings", "Safe offline assessment"],
  },
  {
    title: "Portable Diagnostic Dashboard",
    desc: "All measurements are captured and displayed on a connected dashboard — on-site via tablet or laptop. No permanent wiring required.",
    items: ["Real-time on-site readouts", "Bluetooth & wired connectivity", "Automatic report generation", "Export to PDF / CSV"],
  },
  {
    title: "Cloud Data Sync (Optional)",
    desc: "Optionally upload diagnostic results to Splendid Monitor for trend tracking across multiple assets and sites over time.",
    items: ["Sync to Splendid Monitor platform", "Multi-asset trending", "Historical comparison", "Remote engineering review"],
  },
];

const assets = [
  "MV & LV Induction Motors",
  "Pumps & Pump Sets",
  "Fans & Blowers",
  "Compressors",
  "Gearboxes",
  "Conveyors",
  "Generators",
  "ATEX Rated Machines",
];

const useCases = [
  {
    title: "Pre-Planned Maintenance Survey",
    desc: "Walk around your plant with the kit and capture the health of all critical motors in a single shift — without removing any covers or stopping production.",
  },
  {
    title: "Post-Repair Acceptance Test",
    desc: "Verify that a repaired or rewound motor is performing correctly before it goes back into service.",
  },
  {
    title: "Fault Investigation",
    desc: "Use the kit to quickly diagnose an underperforming or tripping motor and produce an evidence-based fault report.",
  },
  {
    title: "Reliability Engineering Study",
    desc: "Feed diagnostic data into a formal RAM or FMEA study. The kit integrates with Splendid Reliability for analysis.",
  },
];

export default function MotorHealthMonitoringKitPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                  In Development
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/50">
                  Hardware + Software
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                Motor Health Monitoring Kit
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                A portable, affordable diagnostic kit for assessing the health of industrial motors,
                pumps, fans, and rotating machinery &mdash; without a permanent installation.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Designed for maintenance engineers, reliability teams, and industrial SMEs who need
                professional-grade motor diagnostics without the cost of a fixed condition monitoring
                system.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Register Interest
                </Link>
                <Link
                  href="/proof-of-concept"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  View IoT Proof of Concept
                </Link>
              </div>
            </div>

            {/* Asset tags */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-400">
                Compatible Assets
              </p>
              <div className="flex flex-wrap gap-2">
                {assets.map((a) => (
                  <span key={a} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">What the Kit Measures</h2>
        <p className="mt-2 text-sm text-slate-500">
          Six diagnostic capabilities in a single portable kit &mdash; from vibration and current
          analysis to insulation health and cloud sync.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#0b1f3a]">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{f.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {f.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">How It&rsquo;s Used</h2>
          <p className="mt-2 text-sm text-slate-500">
            The kit fits naturally into your existing maintenance workflow.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {useCases.map((u) => (
              <div key={u.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-[#0b1f3a]">{u.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration strip */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Works with the Splendid Product Suite</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Splendid Monitor", desc: "Upload kit data for long-term trend monitoring and multi-site dashboards.", href: "/products/splendid-monitor" },
            { title: "Splendid Reliability", desc: "Feed failure records and diagnostic results into MTBF and reliability calculations.", href: "/products/splendid-reliability" },
            { title: "Reliability Engineering Service", desc: "Use kit findings as evidence in a formal RAM study or FMEA engagement.", href: "/services/reliability-engineering" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-slate-200 p-5 hover:border-green-400 hover:shadow-sm"
            >
              <h3 className="font-semibold text-[#0b1f3a]">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              <span className="mt-3 inline-block text-xs font-medium text-green-600">Learn more &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            In Development
          </span>
          <h2 className="mt-4 text-3xl font-bold">
            Be the first to get the Motor Health Monitoring Kit
          </h2>
          <p className="mt-3 text-slate-300">
            Register your interest and we&rsquo;ll keep you updated on availability, pricing, and
            early access opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Register Interest
            </Link>
            <Link
              href="/services/iot-solutions"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              IoT &amp; Condition Monitoring Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
