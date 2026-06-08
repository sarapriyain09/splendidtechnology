import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Digitalization Services UK | CRM, ERP, Supply Chain, IoT & Web App Development | Splendid Technology",
  description:
    "Digital solutions for UK engineering and manufacturing SMEs across CRM, operations, ERP and supply chain workflows, IoT asset intelligence, and web app development.",
  keywords: [
    "engineering digitalization uk",
    "manufacturing digital transformation uk",
    "crm for engineering companies uk",
    "erp workflow automation uk",
    "supply chain digitalisation uk",
    "industrial iot solutions uk",
    "web app development uk",
    "crm erp solutions uk",
    "digital solutions for manufacturers",
  ],
  alternates: {
    canonical: "/services",
  },
};

const engineeringServiceLines = [
  {
    icon: "📈",
    label: "CRM",
    title: "CRM and Sales Systems",
    description:
      "Lead capture, customer management, quote workflows, and commercial dashboards to improve sales execution.",
    bullets: [
      "CRM implementation and migration",
      "Lead and follow-up automation",
      "Quote and proposal workflows",
      "Customer lifecycle tracking",
      "Pipeline reporting",
      "Commercial process standardization",
    ],
    href: "/services/sales-crm",
    cta: "CRM and Sales Systems",
    highlight: true,
  },
  {
    icon: "🏭",
    label: "ERP",
    title: "Operations, ERP and Supply Chain",
    description:
      "Digitize job execution, inventory, warehouse, and supply chain workflows with practical ERP-aligned systems.",
    bullets: [
      "Job and work-order tracking",
      "Inventory and warehouse workflows",
      "Supply chain visibility and planning",
      "ERP module setup and integration",
      "Approval and handoff automation",
      "Operational KPI dashboards",
      "Supplier and procurement process flows",
    ],
    href: "/services/software-development#erp",
    cta: "Operations, ERP and Supply Chain",
    highlight: true,
  },
  {
    icon: "📡",
    label: "IoT",
    title: "IoT and Asset Intelligence",
    description:
      "Connect critical equipment to telemetry, dashboards, and predictive maintenance workflows.",
    bullets: [
      "Condition monitoring systems",
      "Raspberry Pi and edge deployment",
      "Asset telemetry dashboards",
      "Alerting and escalation logic",
      "Predictive maintenance workflows",
      "Reliability performance reporting",
    ],
    href: "/services/iot-solutions",
    cta: "IoT and Asset Intelligence",
    highlight: false,
  },
  {
    icon: "🧠",
    label: "Web Apps",
    title: "Web App Development",
    description:
      "Build customer portals, internal tools, workflow apps, and scalable SaaS systems.",
    bullets: [
      "Custom web application development",
      "Customer and partner portals",
      "Internal workflow applications",
      "SaaS product development",
      "API integration and automation",
      "Post-launch support and iteration",
    ],
    href: "/services/web-app-development",
    cta: "Web App Development",
    highlight: false,
  },
  {
    icon: "🤝",
    label: "Delivery",
    title: "Advisory and Implementation",
    description:
      "From assessment to rollout, we design phased implementation plans with clear business outcomes.",
    bullets: [
      "Digitalization assessment",
      "Systems architecture and roadmap",
      "Pilot-to-rollout planning",
      "Integration sequencing",
      "Team enablement",
      "Managed optimization support",
    ],
    href: "/contact",
    cta: "Advisory and Implementation",
    highlight: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Engineering Digitalization Services
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Digital Solutions for Engineering and Manufacturing SMEs
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We help engineering and manufacturing businesses digitize sales, operations,
            assets, and engineering workflows through practical CRM, ERP, supply chain, IoT, and
            web app systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Digitalization Assessment
            </Link>
            <Link
              href="/services/web-app-development"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Explore Web App Development
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas Grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Digitalization Service Categories</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Structured around the business systems engineering and manufacturing SMEs need
            to improve speed, visibility, reliability, and decision quality.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringServiceLines.map((s) => (
              <div
                key={s.title}
                className={`flex flex-col rounded-2xl border p-7 ${
                  s.highlight ? "border-green-400 bg-[#0b1f3a] text-white" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      s.highlight ? "bg-green-500/20 text-green-300" : "bg-[#0b1f3a]/10 text-[#0b1f3a]/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                <h3 className={`mt-4 text-xl font-bold ${s.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {s.title}
                </h3>
                <p className={`mt-2 text-sm leading-6 ${s.highlight ? "text-white/70" : "text-black/60"}`}>
                  {s.description}
                </p>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-2 text-sm ${s.highlight ? "text-white/70" : "text-black/70"}`}
                    >
                      <span className="mt-0.5 font-bold text-green-500">&#10004;</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${
                    s.highlight ? "text-green-400 hover:text-green-300" : "text-[#0b1f3a] hover:text-green-700"
                  }`}
                >
                  Learn more about {s.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning strip */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Our Positioning</p>
          <blockquote className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-8 text-white">
            &ldquo;We help engineering and manufacturing SMEs make better decisions through
            connected sales, operational, asset, and web application systems.
            Every rollout phase is tied to measurable business outcomes.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f7f7] py-14 text-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Not sure where to start?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
            Start with a digitalization assessment. We identify your biggest bottlenecks,
            then define a phased roadmap and implementation priorities with measurable ROI.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Book Assessment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Review Categories
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
