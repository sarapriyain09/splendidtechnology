import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Industrial IoT & Condition Monitoring Services UK | Velynxia",
  description:
    "Industrial IoT solutions for UK manufacturers — motor health monitoring, vibration analysis, energy monitoring, predictive maintenance dashboards, and digital twins. Based in Leicester.",
  keywords: [
    "industrial iot uk",
    "motor condition monitoring uk",
    "vibration monitoring uk",
    "energy monitoring industrial uk",
    "predictive maintenance uk",
    "industrial iot dashboards uk",
    "digital twin uk",
    "smart motor monitoring leicester",
  ],
  alternates: {
    canonical: "/services/iot-solutions",
  },
};

const solutions = [
  {
    icon: "📡",
    title: "Motor Health Monitoring",
    desc: "Continuous monitoring of motor current, temperature, vibration, and health scores. Get alerted before failures occur.",
  },
  {
    icon: "📳",
    title: "Vibration Analysis",
    desc: "FFT vibration analysis to detect bearing wear, imbalance, misalignment, and resonance in rotating plant.",
  },
  {
    icon: "⚡",
    title: "Energy Monitoring",
    desc: "Track power consumption per asset. Identify inefficiencies, reduce energy costs, and meet ESG reporting requirements.",
  },
  {
    icon: "🖥️",
    title: "IoT Dashboards",
    desc: "Live operational dashboards showing asset health, uptime, fault history, and maintenance status across your site.",
  },
  {
    icon: "🔮",
    title: "Predictive Maintenance",
    desc: "AI-driven maintenance scheduling based on real sensor data — move from reactive breakdowns to planned, low-impact servicing.",
  },
  {
    icon: "🏭",
    title: "Digital Twins",
    desc: "Virtual models of your physical assets — simulate failure scenarios, optimise maintenance intervals, and plan upgrades.",
  },
];

export default function IoTSolutionsPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — IoT &amp; Condition Monitoring
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Industrial IoT &amp; Condition Monitoring
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Know what&apos;s happening inside your plant before problems become breakdowns.
            We deploy motor health monitoring, vibration analysis, energy monitoring, and
            predictive maintenance systems with digital twin capability for UK manufacturers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Site Assessment
            </Link>
            <Link
              href="/industrial-iot"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View IoT Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">IoT & Monitoring Solutions</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Deployed across motors, pumps, fans, compressors, HVAC, and any rotating or
            critical industrial asset.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <div key={s.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital twin architecture */}
      <section className="bg-[#f7f9fc] py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">AI-Driven Digital Twin Architecture</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
            End-to-end architecture from physical assets and edge devices to AWS cloud services,
            digital twin modelling, and AI prediction outputs for fault detection and remaining useful life.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <Image
              src="/images/industrial-iot/dital-twins.png"
              alt="AI-driven industrial digital twin architecture showing sensors, edge processing, cloud platform, twin model, and AI analytics"
              width={1536}
              height={1024}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Assets covered */}
      <section className="bg-[#f7f7f7] py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Assets We Monitor</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Electric Motors", "Pumps", "Fans & Blowers", "Compressors", "HVAC Systems", "Conveyors", "Gearboxes", "Drives & Inverters"].map((a) => (
              <span key={a} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#0b1f3a]">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Get Started</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-white">
              Start with a free site assessment
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              We visit your site, identify the highest-risk assets, and propose a monitoring
              solution sized for your budget — with a clear ROI calculation.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Book a Site Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
