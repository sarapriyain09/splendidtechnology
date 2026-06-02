import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Industrial IoT, Engineering & Software Automation | Splendid Technology",
  description:
    "Splendid Technology delivers Industrial IoT, Predictive Maintenance, Reliability Engineering, CAD Design, FEA Analysis, Reverse Engineering, and Software Automation for UK manufacturers.",
  keywords: [
    "industrial iot solutions uk",
    "predictive maintenance uk",
    "reliability engineering services uk",
    "cad design uk",
    "fea analysis uk",
    "cfd analysis uk",
    "reverse engineering uk",
    "rapid prototyping uk",
    "manufacturing support uk",
    "software automation uk",
    "crm software uk",
    "web app development uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const serviceAreas = [
  {
    icon: "�",
    label: "Strategic Growth",
    title: "Industrial IoT & Reliability",
    description:
      "Smart motor health monitoring, predictive maintenance, vibration analysis, condition monitoring, and reliability engineering — our primary focus and long-term strategic growth area.",
    bullets: [
      "Motor health & vibration monitoring",
      "Predictive maintenance systems",
      "Energy consumption monitoring",
      "Industrial IoT dashboards",
      "MTBF, FMEA & RAM analysis",
      "Portable diagnostic kits",
    ],
    href: "/services/iot-solutions",
    cta: "Industrial IoT & Reliability",
    highlight: true,
  },
  {
    icon: "🔩",
    label: "Near-Term Revenue",
    title: "Engineering & Manufacturing",
    description:
      "3D CAD design, FEA structural analysis, CFD simulation, reverse engineering, rapid prototyping, and manufacturing support — generating revenue while the IoT platform matures.",
    bullets: [
      "3D CAD design & manufacturing drawings",
      "FEA & structural analysis",
      "CFD analysis & simulation",
      "Reverse engineering & legacy components",
      "Rapid prototyping & design validation",
      "Design for Manufacturing (DFM) & BOM",
    ],
    href: "/services/engineering-manufacturing",
    cta: "Engineering & Manufacturing",
    highlight: true,
  },
  {
    icon: "💻",
    label: "Recurring Revenue",
    title: "Software & Automation",
    description:
      "Custom CRM systems, web applications, SaaS platforms, AI process automation, customer portals, and business dashboards — providing recurring revenue that complements our industrial services.",
    bullets: [
      "CRM & sales pipeline systems",
      "Web & app development",
      "AI process automation",
      "Customer portals & dashboards",
      "Asset management systems",
      "SaaS platform development",
    ],
    href: "/services/software-development",
    cta: "Software & Automation",
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
            Three Service Pillars. One Engineering Technology Partner.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Industrial IoT &amp; Reliability for long-term strategic growth — Engineering &amp; Manufacturing
            for immediate revenue — Software &amp; Automation for recurring income.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Our Three Service Pillars</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Each pillar serves a distinct commercial purpose — together they form a complete engineering technology business.
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
            &ldquo;Splendid Technology is an Industrial Technology &amp; Engineering Solutions company
            helping UK manufacturers improve reliability, productivity, and innovation through
            Industrial IoT, predictive maintenance, engineering design, and software automation.&rdquo;
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
