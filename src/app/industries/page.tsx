import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve | Manufacturing, Engineering, SME | Splendid Technology",
  description:
    "Splendid Technology serves UK manufacturers, engineering businesses, industrial SMEs, and professional services firms — delivering web apps, IoT solutions, reliability engineering, and business software.",
  keywords: [
    "industrial technology solutions uk",
    "manufacturing software uk",
    "engineering business software uk",
    "sme digital transformation uk",
    "industrial iot manufacturing uk",
    "reliability engineering manufacturing uk",
  ],
  alternates: { canonical: "/industries" },
};

const industries = [
  {
    icon: "🏭",
    title: "Manufacturing",
    desc: "Process and discrete manufacturers across the UK — from food & beverage to precision engineering. We deliver motor monitoring, predictive maintenance, production dashboards, and custom manufacturing software.",
    services: ["IoT & Condition Monitoring", "Reliability Engineering", "Splendid Monitor", "Custom Software"],
  },
  {
    icon: "⚡",
    title: "Utilities & Energy",
    desc: "Water treatment, power generation, and energy distribution businesses managing critical rotating plant across multiple sites. Continuous monitoring, reliability analysis, and compliance tools.",
    services: ["IoT & Condition Monitoring", "FMEA / RAM Studies", "Compliance Software", "Energy Monitoring"],
  },
  {
    icon: "🔧",
    title: "Maintenance & Engineering Contractors",
    desc: "MRO contractors, engineering service companies, and facilities management businesses. MTBF tracking, job costing, asset management, and mobile field tools.",
    services: ["Splendid Reliability", "Job Costing Software", "Mobile Field Tools", "Splendid Asset Manager"],
  },
  {
    icon: "🏗️",
    title: "Construction & Infrastructure",
    desc: "Construction firms and civil engineering businesses needing project accounting, plant management, and compliance tracking for large infrastructure projects.",
    services: ["Splendid Accounting", "Asset Management", "Project Tracking", "Compliance Tools"],
  },
  {
    icon: "💼",
    title: "Professional Services & SMEs",
    desc: "Accountancy firms, consultancies, and general SMEs needing modern web applications, customer portals, SaaS tools, and business software to grow faster.",
    services: ["Web & App Development", "SaaS Applications", "Customer Portals", "Splendid Accounting"],
  },
  {
    icon: "🌿",
    title: "Environmental & Sustainability",
    desc: "Businesses with ESG reporting requirements, environmental compliance needs, or energy efficiency targets. Energy monitoring, automated reporting, and carbon tracking tools.",
    services: ["Energy Monitoring", "Automated Reporting", "Compliance Software", "IoT Dashboards"],
  },
];

export default function IndustriesPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Industries We Serve
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Technology for Industrial &amp; Engineering Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We work with manufacturers, engineering contractors, utilities, and SMEs across
            the UK — delivering web applications, IoT monitoring, reliability engineering,
            and business software sized for your industry.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Discuss Your Industry
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Industries grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Industries</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Not every industry needs the same solution. We tailor our services and products
            to the specific challenges your sector faces.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <div key={ind.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{ind.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{ind.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{ind.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ind.services.map((s) => (
                    <span key={s} className="rounded-full bg-[#0b1f3a]/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#0b1f3a]/70">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UK focus */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-400">UK-Based</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Serving UK businesses from Leicester</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                We&apos;re a UK-based technology company. We understand UK regulations, the MTD
                requirements, UK manufacturing challenges, and the realities of running an
                SME in Britain. No offshore teams, no timezone friction.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {["On-site visits and assessments available nationwide", "UK tax, VAT, and MTD compliance built in", "GDPR-compliant data handling as standard", "Leicester-based team with national reach"].map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4">
                  <span className="font-bold text-green-400">✔</span>
                  <span className="text-sm text-white/80">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Don&apos;t see your industry?</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            We work with a wide range of businesses. Get in touch and tell us about your
            challenges — we&apos;ll tell you honestly whether we can help.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
