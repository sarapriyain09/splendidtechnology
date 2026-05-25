import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Motor Monitoring | Splendid Technology Industrial IoT",
  description:
    "Real-time motor health monitoring for UK manufacturers. Detect overheating, vibration anomalies, and performance degradation before they cause downtime. Affordable solutions for SMEs.",
  keywords: [
    "smart motor monitoring uk",
    "motor condition monitoring",
    "real-time motor health uk",
    "motor failure prevention",
    "industrial motor monitoring sme",
    "iot motor monitoring leicester",
  ],
  alternates: {
    canonical: "/industrial-iot/smart-motor-monitoring",
  },
};

const problems = [
  "A motor fails without warning — halting production for hours.",
  "Emergency callouts and expedited parts are expensive.",
  "Your maintenance team doesn't know which motor needs attention first.",
  "Overheating or vibration issues go undetected until it's too late.",
];

const capabilities = [
  {
    title: "Temperature Monitoring",
    description:
      "Continuous thermal tracking flags overheating conditions early — before insulation damage or winding failure occurs.",
  },
  {
    title: "Vibration Analysis",
    description:
      "Detect bearing wear, imbalance, and misalignment through vibration signatures — catching issues weeks before breakdown.",
  },
  {
    title: "Current & Load Tracking",
    description:
      "Monitor electrical load patterns to identify overloaded motors or efficiency degradation.",
  },
  {
    title: "Real-Time Alerts",
    description:
      "Instant notifications to your team when readings exceed safe thresholds — by email, SMS, or dashboard alert.",
  },
  {
    title: "Live Dashboard",
    description:
      "A clean, web-based dashboard showing all monitored motors at a glance — accessible on any device.",
  },
  {
    title: "Historical Trend Data",
    description:
      "Review performance trends over time to understand asset health and make informed maintenance decisions.",
  },
];

const steps = [
  {
    step: "1",
    title: "Discovery Call",
    description:
      "We learn about your equipment, site, and maintenance challenges.",
  },
  {
    step: "2",
    title: "Pilot Design",
    description:
      "We design a monitoring solution for 1–3 motors so you can validate value before committing.",
  },
  {
    step: "3",
    title: "Deployment",
    description:
      "Sensors are fitted, data flows to your dashboard. Minimal disruption to your operations.",
  },
  {
    step: "4",
    title: "Ongoing Support",
    description:
      "We monitor, refine thresholds, and help you act on what the data tells you.",
  },
];

export default function SmartMotorMonitoringPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-xs text-black/50">
        <Link href="/industrial-iot" className="hover:text-[#0b3d91]">
          Industrial IoT
        </Link>
        <span>/</span>
        <span>Smart Motor Monitoring</span>
      </nav>

      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-[#0b3d91]">
          Industrial IoT — Core Service
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Smart Motor Monitoring
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Know the health of every critical motor on your site — in real time. Our
          monitoring systems catch faults early, so your team can act before a failure
          stops production.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
          >
            Request a pilot project
          </Link>
          <Link
            href="/industrial-iot/predictive-maintenance"
            className="inline-block rounded-lg border border-[#0b3d91] px-5 py-2.5 text-sm font-medium text-[#0b3d91] hover:bg-[#0b3d91]/5"
          >
            See Predictive Maintenance →
          </Link>
        </div>
      </header>

      {/* System diagram */}
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <Image
          src="/images/industrial-iot/smart-motor.png"
          alt="Smart Motor Monitoring System — showing data acquisition sensors, edge gateway, cloud platform, live dashboard, and alerts"
          width={1200}
          height={675}
          className="w-full"
          priority
        />
      </section>

      {/* The problem */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">The Problem We Solve</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Most industrial motors are run-to-fail. No monitoring. No early warning. Just
          reactive maintenance after the damage is done.
        </p>
        <ul className="mt-4 space-y-2">
          {problems.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-black/70">
              <span className="mt-0.5 text-red-500">✗</span>
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-medium text-black/80">
          Smart Motor Monitoring changes this — giving your team the data they need to
          act early, every time.
        </p>
      </section>

      {/* Capabilities */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What We Monitor</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3d91] text-sm font-bold text-white">
                {step.step}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-black/70">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-[#0b3d91]/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Start With a Pilot</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
          We recommend starting with a small pilot — monitoring 1 to 3 motors. This
          lets you see the value quickly without a large upfront commitment. We'll work
          with you to design and deploy the right solution for your site.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
        >
          Get in touch →
        </Link>
      </section>

      {/* Back link */}
      <div>
        <Link href="/industrial-iot" className="text-sm text-[#0b3d91] hover:underline">
          ← Back to Industrial IoT
        </Link>
      </div>
    </div>
  );
}
