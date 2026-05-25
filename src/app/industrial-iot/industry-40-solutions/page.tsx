import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry 4.0 Solutions for UK SMEs | Splendid Technology",
  description:
    "Affordable Industry 4.0 and smart factory solutions for UK small and medium manufacturers. Edge monitoring, live dashboards, and automation tools — without enterprise complexity.",
  keywords: [
    "industry 4.0 solutions uk",
    "smart factory solutions uk",
    "industry 4.0 for sme uk",
    "edge monitoring uk manufacturer",
    "affordable smart factory uk",
    "digital transformation manufacturer uk",
    "iot dashboard uk",
  ],
  alternates: {
    canonical: "/industrial-iot/industry-40-solutions",
  },
};

const solutions = [
  {
    title: "Edge Monitoring",
    description:
      "Collect and process data at the source — on your factory floor — without relying entirely on cloud connectivity. Fast, reliable, and low-latency.",
  },
  {
    title: "Live Operations Dashboard",
    description:
      "A clear, real-time view of your site's key metrics — accessible on any screen. No complex ERP. Just the data your team needs, when they need it.",
  },
  {
    title: "Alert & Notification Systems",
    description:
      "Automatically notify the right person when something needs attention — by email, SMS, or on-screen. Configurable thresholds and escalation rules.",
  },
  {
    title: "Data Historian & Trend Analysis",
    description:
      "Store and visualise historical performance data. Spot patterns, plan maintenance, and make evidence-based decisions about your equipment and processes.",
  },
  {
    title: "Workflow Automation",
    description:
      "Connect your monitoring data to your existing tools — maintenance logs, ticketing systems, or reporting workflows — to reduce manual admin.",
  },
  {
    title: "Pilot to Production",
    description:
      "We design small, low-risk pilots so you can validate value quickly. When it works, we scale it. No expensive lock-in at the start.",
  },
];

const principles = [
  {
    title: "Sized for SMEs, not enterprises",
    description:
      "Industry 4.0 doesn't require a seven-figure budget. We design solutions that deliver real value at a scale your business can afford and manage.",
  },
  {
    title: "Focus on operational outcomes",
    description:
      "We don't sell technology for technology's sake. Everything we build is tied to a measurable outcome: reduced downtime, lower costs, better decisions.",
  },
  {
    title: "Built around your equipment",
    description:
      "We work with what you have. No requirement to replace existing machinery — we add intelligence on top of your current assets.",
  },
  {
    title: "Low disruption deployment",
    description:
      "We respect that your site needs to keep running. Deployments are planned to minimise disruption to your operations.",
  },
];

const roadmap = [
  { phase: "Now", label: "Motor & equipment monitoring", current: true },
  { phase: "Next", label: "Multi-asset site dashboards", current: false },
  { phase: "Later", label: "Conveyor, pump & HVAC monitoring", current: false },
  { phase: "Later", label: "Warehouse & logistics visibility", current: false },
  { phase: "Future", label: "Digital twin integration", current: false },
];

export default function Industry40SolutionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-xs text-black/50">
        <Link href="/industrial-iot" className="hover:text-[#0b3d91]">
          Industrial IoT
        </Link>
        <span>/</span>
        <span>Industry 4.0 Solutions</span>
      </nav>

      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-[#0b3d91]">
          Industrial IoT — Service
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Industry 4.0 Solutions for UK SMEs
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Smart factory technology doesn't have to mean enterprise complexity or
          enterprise cost. We build practical Industry 4.0 solutions for UK small and
          medium manufacturers — starting with what you need most, and growing from
          there.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
          >
            Talk to us about your site
          </Link>
          <Link
            href="/industrial-iot"
            className="inline-block rounded-lg border border-[#0b3d91] px-5 py-2.5 text-sm font-medium text-[#0b3d91] hover:bg-[#0b3d91]/5"
          >
            See all Industrial IoT services →
          </Link>
        </div>
      </header>

      {/* Page image */}
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <Image
          src="/images/industrial-iot/Industrial-iot-frontpage.png"
          alt="Industry 4.0 Solutions — showing Monitor, Optimise, Integrate, Digital Twin and Smart Factory journey with IoT capabilities"
          width={1200}
          height={800}
          className="w-full"
          priority
        />
      </section>

      {/* Solutions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What We Build</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol) => (
            <div
              key={sol.title}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <h3 className="font-semibold">{sol.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{sol.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Our Approach</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Where We're Going</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          We're starting focused — smart motor monitoring and predictive maintenance
          first. From there we expand to cover more of your site.
        </p>
        <ol className="mt-5 space-y-3">
          {roadmap.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span
                className={`mt-0.5 min-w-[60px] rounded-full px-2 py-0.5 text-center text-xs font-medium ${
                  item.current
                    ? "bg-[#0b3d91] text-white"
                    : "bg-black/10 text-black/60"
                }`}
              >
                {item.phase}
              </span>
              <span
                className={`text-sm ${item.current ? "font-medium text-black/90" : "text-black/60"}`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-[#0b3d91]/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Let's Start Small and Prove It</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
          The best Industry 4.0 implementations don't start with a masterplan — they
          start with a focused pilot that delivers measurable value quickly. We'll help
          you identify the highest-impact starting point for your site and build from
          there.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-lg bg-[#0b3d91] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#092f72]"
        >
          Start the conversation →
        </Link>
      </section>

      <div>
        <Link href="/industrial-iot" className="text-sm text-[#0b3d91] hover:underline">
          ← Back to Industrial IoT
        </Link>
      </div>
    </div>
  );
}
