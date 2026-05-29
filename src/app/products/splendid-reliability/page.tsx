import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splendid Reliability | MTBF Calculation & Reliability Tracking Software UK",
  description:
    "Splendid Reliability — automated MTBF calculations, failure tracking, and reliability analysis software for UK engineering teams. Stop using spreadsheets. Start using data.",
  keywords: [
    "mtbf calculation software uk",
    "reliability tracking software uk",
    "fmea software uk",
    "failure tracking software uk",
    "maintenance interval optimisation software",
    "splendid reliability",
    "reliability engineering software uk",
  ],
  alternates: { canonical: "/products/splendid-reliability" },
};

const features = [
  { icon: "⏱️", title: "Automated MTBF", desc: "Enter failure events and the platform calculates MTBF per asset, asset class, and site automatically." },
  { icon: "📋", title: "Failure Tracking", desc: "Log failures with cause, mode, component, and corrective action. Build a searchable failure history." },
  { icon: "📈", title: "Reliability Trending", desc: "Track how MTBF changes over time. Spot improving or degrading assets before they become problems." },
  { icon: "🔄", title: "Interval Optimisation", desc: "Use your actual failure data to set evidence-based PM intervals — not manufacturer guesses." },
  { icon: "📊", title: "Reliability Reports", desc: "Generate MTBF reports, failure summaries, and maintenance KPI dashboards for management." },
  { icon: "🔗", title: "IoT Integration", desc: "Connect to Splendid Monitor for real-time failure detection and automatic failure event logging." },
];

export default function SplendidReliabilityPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Product — Early Access
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Splendid Reliability
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">MTBF calculations & reliability tracking software</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Stop calculating MTBF in spreadsheets. Splendid Reliability automates failure
            tracking, MTBF calculations, and maintenance interval optimisation — giving
            engineering teams the data to make better maintenance decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tools/mtbf"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Try the Free MTBF Tool
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Join Early Access
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

      <section className="bg-[#0b1f3a] px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Free Tool Available Now</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Try the MTBF Calculator</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Our free online MTBF tool lets you calculate Mean Time Between Failures for any
            asset — no sign-up required. A preview of what Splendid Reliability offers.
          </p>
          <div className="mt-6">
            <Link
              href="/tools/mtbf"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Open the MTBF Tool
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
