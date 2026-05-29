import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splendid Monitor | Industrial IoT Dashboards & Condition Monitoring Software",
  description:
    "Splendid Monitor — real-time industrial IoT dashboards for motors, pumps, fans, and rotating plant. Vibration monitoring, energy tracking, predictive alerts, and digital twins for UK manufacturers.",
  keywords: [
    "industrial iot dashboard software uk",
    "motor monitoring software uk",
    "condition monitoring software uk",
    "predictive maintenance software uk",
    "splendid monitor",
    "vibration monitoring software uk",
    "digital twin software uk",
    "energy monitoring software uk",
  ],
  alternates: { canonical: "/products/splendid-monitor" },
};

const features = [
  { icon: "🖥️", title: "Live Asset Dashboards", desc: "Real-time health scores, vibration levels, temperature, and current for every monitored asset on a single dashboard." },
  { icon: "📳", title: "Vibration Analysis", desc: "FFT vibration spectrum analysis, trend tracking, and threshold alerts for bearing wear, imbalance, and misalignment." },
  { icon: "⚡", title: "Energy Monitoring", desc: "Per-asset power consumption tracking, efficiency scoring, and energy cost reporting." },
  { icon: "🔔", title: "Predictive Alerts", desc: "AI-driven alert thresholds that adapt to each asset's baseline — fewer false alarms, earlier genuine warnings." },
  { icon: "🏭", title: "Digital Twins", desc: "Virtual models of your critical assets showing current state, failure probability, and projected maintenance windows." },
  { icon: "📋", title: "Maintenance Triggers", desc: "Automatically create maintenance work orders when sensor thresholds are exceeded — connected to your CMMS." },
];

export default function SplendidMonitorPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            Product — In Development
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Splendid Monitor
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">Industrial IoT dashboards & condition monitoring</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            A cloud-connected industrial IoT platform that gives you real-time visibility into
            the health of your motors, pumps, fans, and rotating plant — before failures happen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Request a Demo
            </Link>
            <Link
              href="/services/iot-solutions"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              IoT Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Platform Features</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Assets Supported</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Electric Motors", "Pumps", "Fans & Blowers", "Compressors", "HVAC Systems", "Conveyors", "Gearboxes", "Drives & Inverters"].map((a) => (
              <span key={a} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#0b1f3a]">
                {a}
              </span>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-[#0b1f3a] p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Need it now?</p>
            <h3 className="mt-2 text-xl font-bold text-white">We also deliver this as a managed service</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              While Splendid Monitor is in development, we deploy bespoke industrial IoT
              monitoring solutions for manufacturers. Same capability, delivered as a project.
            </p>
            <div className="mt-5">
              <Link
                href="/services/iot-solutions"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                View IoT Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
