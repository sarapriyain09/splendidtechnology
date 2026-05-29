import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Web & App Development, IoT, Reliability Engineering | Splendid Technology",
  description:
    "Splendid Technology delivers Web & App Development, Industrial IoT Solutions, Reliability Engineering, and custom Software Development for UK SMEs and industrial businesses.",
  keywords: [
    "web app development uk",
    "industrial iot solutions uk",
    "reliability engineering services uk",
    "software development leicester",
    "saas development uk",
    "custom business software uk",
    "mtbf fmea reliability uk",
    "iot condition monitoring uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const serviceAreas = [
  {
    icon: "💻",
    label: "Development",
    title: "Web & App Development",
    description:
      "Business websites, SaaS applications, customer portals, mobile apps, API integrations, and cloud solutions — built for performance, security, and growth.",
    bullets: [
      "Business websites & landing pages",
      "SaaS application development",
      "Customer portals & dashboards",
      "Mobile apps (iOS & Android)",
      "API development & integrations",
      "AI integrations & automations",
    ],
    href: "/services/web-app-development",
    cta: "Web & App Services",
    highlight: true,
  },
  {
    icon: "📡",
    label: "Industrial IoT",
    title: "IoT & Condition Monitoring",
    description:
      "Motor health monitoring, vibration analysis, energy monitoring, industrial IoT dashboards, and digital twins — designed for UK manufacturers and engineers.",
    bullets: [
      "Motor health & vibration monitoring",
      "Energy consumption monitoring",
      "Industrial IoT dashboards",
      "Digital twins & asset models",
      "Predictive maintenance systems",
      "Portable diagnostic kits",
    ],
    href: "/services/iot-solutions",
    cta: "IoT Solutions",
    highlight: false,
  },
  {
    icon: "⚙️",
    label: "Engineering",
    title: "Reliability Engineering",
    description:
      "MTBF analysis, FMEA/FMECA studies, RAM analysis, RCM, and asset performance analytics — evidence-based reliability for engineering teams.",
    bullets: [
      "MTBF analysis & calculations",
      "FMEA / FMECA studies",
      "RAM (Reliability, Availability, Maintainability)",
      "RCM — Reliability Centred Maintenance",
      "Asset performance analytics",
      "Maintenance interval optimisation",
    ],
    href: "/services/reliability-engineering",
    cta: "Reliability Engineering",
    highlight: false,
  },
  {
    icon: "🖥️",
    label: "Software",
    title: "Software Development",
    description:
      "Custom business software, SME accounting systems, asset management, ERP modules, and workflow tools — built around how your business actually works.",
    bullets: [
      "Custom business software",
      "SME accounting & finance tools",
      "Asset management systems",
      "ERP modules & integrations",
      "Workflow automation tools",
      "Data reporting & analytics",
    ],
    href: "/services/software-development",
    cta: "Software Development",
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
            Splendid Technology &mdash; Services
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Four Service Areas. One Technology Partner.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            From building your web application to monitoring your industrial plant &mdash;
            Splendid Technology delivers Web &amp; App Development, IoT Solutions,
            Reliability Engineering, and custom Software for UK businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Our Products
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas Grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Our Service Areas</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Each service area is a focused discipline &mdash; delivered by specialists, not generalists.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {serviceAreas.map((s) => (
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
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Our Promise</p>
          <blockquote className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-8 text-white">
            &ldquo;Splendid Technology delivers Web Applications, SaaS Platforms, Industrial IoT
            Solutions, Reliability Engineering Software, and Digital Transformation Services for
            SMEs and industrial businesses.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f7f7] py-14 text-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Not sure which service fits?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
            Book a free 30-minute consultation and we&apos;ll help you identify exactly which
            combination of services will generate the best return for your business.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Browse Our Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
