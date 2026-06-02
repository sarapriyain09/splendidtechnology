import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering & Manufacturing Solutions UK | CAD Design, FEA, CFD | Splendid Technology",
  description:
    "Engineering design, FEA structural analysis, CFD simulation, reverse engineering, rapid prototyping, and manufacturing support for UK engineering and manufacturing businesses.",
  keywords: [
    "cad design uk",
    "3d cad design leicester",
    "fea analysis uk",
    "structural analysis uk",
    "cfd analysis uk",
    "reverse engineering uk",
    "rapid prototyping uk",
    "product design uk",
    "manufacturing drawings uk",
    "design for manufacturing uk",
    "engineering services leicester",
    "mechanical design uk",
  ],
  alternates: {
    canonical: "/services/engineering-manufacturing",
  },
  openGraph: {
    type: "website",
    title: "Engineering & Manufacturing Solutions | Splendid Technology",
    description:
      "CAD design, FEA analysis, CFD simulation, reverse engineering, and rapid prototyping for UK engineering and manufacturing businesses.",
    url: "https://www.splendidtechnology.co.uk/services/engineering-manufacturing",
  },
};

const services = [
  {
    id: "cad",
    icon: "📐",
    tag: "Design",
    title: "3D CAD Design & Drawings",
    description:
      "Professional 3D product and mechanical design, assembly modelling, and manufacturing drawings produced to BS 8888 standards.",
    bullets: [
      "Product & mechanical design",
      "Assembly & sub-assembly models",
      "Manufacturing & detail drawings",
      "BOM (Bill of Materials) development",
      "Design for Assembly (DFA)",
      "Supplier-ready documentation",
    ],
  },
  {
    id: "fea",
    icon: "🔬",
    tag: "Simulation",
    title: "FEA & Structural Analysis",
    description:
      "Finite element analysis to validate designs before manufacture, identify failure points, and reduce over-engineering.",
    bullets: [
      "Static structural analysis",
      "Fatigue & cyclic load analysis",
      "Thermal stress simulation",
      "Weld & joint analysis",
      "Design optimisation",
      "Simulation reports for clients",
    ],
  },
  {
    id: "cfd",
    icon: "🌊",
    tag: "Simulation",
    title: "CFD Analysis",
    description:
      "Computational fluid dynamics simulation for airflow, heat transfer, pressure drops, and fluid system optimisation.",
    bullets: [
      "Internal & external flow analysis",
      "Heat exchanger performance",
      "Pressure drop optimisation",
      "Cooling system design",
      "Ventilation & HVAC analysis",
      "Pump & fan performance",
    ],
  },
  {
    id: "reverse",
    icon: "🔄",
    tag: "Reverse Engineering",
    title: "Reverse Engineering",
    description:
      "Recreate legacy or obsolete components from physical parts, drawings, or measurements when originals no longer exist.",
    bullets: [
      "Legacy component recreation",
      "Measurement & dimensional survey",
      "3D model from physical part",
      "Design modification & improvement",
      "Manufacturing documentation",
      "Material specification support",
    ],
  },
  {
    id: "prototyping",
    icon: "🧪",
    tag: "Prototyping",
    title: "Rapid Prototyping & Product Development",
    description:
      "From concept to functional prototype — design validation, DFM reviews, and manufacturing readiness for UK engineering businesses.",
    bullets: [
      "Concept & prototype design",
      "Design validation & testing support",
      "Functional prototype specifications",
      "Design for Manufacturing (DFM) review",
      "Supplier & manufacturer liaison",
      "Product development roadmap",
    ],
  },
];

const industries = [
  { icon: "⚙️", name: "Manufacturing" },
  { icon: "🏭", name: "Automotive" },
  { icon: "⚡", name: "Electrical Engineering" },
  { icon: "🔧", name: "Maintenance & MRO" },
  { icon: "🛢️", name: "Oil & Gas" },
  { icon: "💨", name: "HVAC & Ventilation" },
  { icon: "🔩", name: "Mechanical Engineering" },
  { icon: "🏗️", name: "Structural Engineering" },
];

export default function EngineeringManufacturingPage() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — Engineering & Manufacturing
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Engineering Design &amp; Manufacturing Solutions
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            CAD design, FEA analysis, CFD simulation, reverse engineering, and rapid prototyping
            for UK engineering and manufacturing businesses. Positioned as your engineering
            technology partner — not a drafting service.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              Discuss Your Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-black/10 bg-white py-8">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { stat: "UK", label: "Based engineering team" },
              { stat: "FEA", label: "Validated designs" },
              { stat: "BS 8888", label: "Drawing standards" },
              { stat: "DFM", label: "Manufacture-ready" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-green-600 sm:text-3xl">{item.stat}</p>
                <p className="mt-1 text-xs text-black/50 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positioning ── */}
      <section className="bg-[#f7f7f7] py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-green-200 bg-white p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-600">Our Positioning</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a]">Engineering Technology Partner — Not a CAD Drafting Service</h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  We position ourselves as your engineering technology partner. Our engineering
                  services are complementary to our Industrial IoT offering — a customer who comes
                  to us for FEA analysis today may need motor condition monitoring and predictive
                  maintenance tomorrow.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { avoid: "Generic CAD drafting service", instead: "Engineering Technology Partner" },
                  { avoid: "Cheap outsourcing company", instead: "Reliability & Product Development Partner" },
                  { avoid: "One-off drawing jobs", instead: "Long-term engineering relationships" },
                  { avoid: "Any industry, any job", instead: "Manufacturing & industrial focus" },
                ].map((item) => (
                  <div key={item.instead} className="rounded-xl border border-black/10 bg-[#f7f7f7] p-4">
                    <p className="text-xs text-red-500/70 line-through">{item.avoid}</p>
                    <p className="mt-1 text-xs font-semibold text-green-700">✔ {item.instead}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">What We Deliver</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Engineering & Manufacturing Services</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Five core service areas covering the full engineering design and development lifecycle.
          </p>
          <div className="mt-10 space-y-8">
            {services.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="scroll-mt-20 rounded-2xl border border-black/10 bg-white p-7 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{s.icon}</span>
                      <span className="rounded-full bg-[#0b1f3a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/60">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-[#0b1f3a]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-black/60">{s.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-black/70">
                        <span className="mt-0.5 font-bold text-green-600">✔</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">Industries We Serve</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Built for UK Engineering & Manufacturing</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {industries.map((i) => (
              <div key={i.name} className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <span className="text-2xl">{i.icon}</span>
                <span className="text-sm font-medium text-[#0b1f3a]">{i.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cross-sell IoT ── */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Our Long-Term Vision</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-white">
              Engineering today. Industrial IoT tomorrow.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Customers who start with engineering design and analysis often progress to motor
              condition monitoring, predictive maintenance, and industrial automation. We build
              those long-term partnerships from day one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "FEA / Design Analysis",
                "→",
                "Motor Health Monitoring",
                "→",
                "Predictive Maintenance",
                "→",
                "Industrial IoT Platform",
              ].map((step, i) => (
                <span
                  key={i}
                  className={
                    step === "→"
                      ? "self-center text-green-400 font-bold"
                      : "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                  }
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services/iot-solutions"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
              >
                Explore Industrial IoT
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                Discuss Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Ready to start your engineering project?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
            Tell us about your design challenge, component, or simulation requirement.
            We&apos;ll assess it and provide a no-obligation quote.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white transition-colors hover:bg-[#0b3d91]"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] transition-colors hover:bg-[#0b1f3a]/5"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
