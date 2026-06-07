import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Services UK | Automation, Drives, Electrical & Digital | Splendid Technology",
  description:
    "Engineering services for UK industry: Automation Engineering, Drive Systems Engineering, Electrical Engineering, Mechanical Engineering, and Digital Engineering (CRM & ERP).",
  keywords: [
    "industrial automation engineering uk",
    "plc programming services uk",
    "scada hmi development uk",
    "drive systems engineering uk",
    "mv drive engineering uk",
    "electrical engineering services uk",
    "control panel design uk",
    "mechanical engineering services uk",
    "crm erp solutions uk",
    "digital engineering services uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const engineeringServiceLines = [
  {
    icon: "⚙️",
    label: "Automation",
    title: "Automation Engineering",
    description:
      "PLC programming, SCADA and HMI development, control system design, FAT support, commissioning, and industrial network architecture.",
    bullets: [
      "PLC programming services",
      "SCADA and HMI development",
      "Control system design",
      "Factory acceptance test support",
      "Commissioning support",
      "Safety systems integration",
    ],
    href: "/services/automation-engineering",
    cta: "Automation Engineering",
    highlight: true,
  },
  {
    icon: "⚡",
    label: "Drives",
    title: "Drive Systems Engineering",
    description:
      "LV and MV AC drives, DC drives, common DC bus systems, AFE rectifiers, soft starters, servo drives, and renewable energy converters.",
    bullets: [
      "LV and MV AC drives",
      "DC drives up to 2250A",
      "AFE systems and rectifiers",
      "Common DC bus architecture",
      "Drive sizing and protection coordination",
      "Integration, FAT, and commissioning",
    ],
    href: "/services/drive-systems-engineering",
    cta: "Drive Systems Engineering",
    highlight: true,
  },
  {
    icon: "🔌",
    label: "Electrical",
    title: "Electrical Engineering",
    description:
      "Detailed electrical engineering and documentation including SLDs, I/O lists, panel design, cable schedules, and protection studies.",
    bullets: [
      "Detailed engineering design",
      "Single line diagrams",
      "I/O lists and cable schedules",
      "Control panel design",
      "Protection studies",
      "Technical specifications",
    ],
    href: "/services/electrical-engineering",
    cta: "Electrical Engineering",
    highlight: false,
  },
  {
    icon: "🔩",
    label: "Mechanical",
    title: "Mechanical Engineering",
    description:
      "Mechanical design and product development support including CAD, FEA, reverse engineering, prototyping, and manufacturing documentation.",
    bullets: [
      "3D CAD and assemblies",
      "Manufacturing drawings",
      "FEA and structural analysis",
      "Reverse engineering",
      "DFM and prototype support",
      "Supplier-ready documentation",
    ],
    href: "/services/mechanical-engineering",
    cta: "Mechanical Engineering",
    highlight: false,
  },
  {
    icon: "💻",
    label: "Digital",
    title: "Digital Engineering",
    description:
      "CRM, ERP, warehouse and supply chain digitalisation solutions that connect sales, operations, and management in one practical platform.",
    bullets: [
      "CRM solutions",
      "ERP solutions",
      "Warehouse management systems",
      "Supply chain digitalisation",
      "Workflow automation",
      "Business dashboards",
    ],
    href: "/services/digital-engineering",
    cta: "Digital Engineering",
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
            Industrial Automation, Drive Systems &amp; Digital Engineering Solutions
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Delivering automation engineering, electrical design, drive systems engineering,
            mechanical engineering, and CRM/ERP digital solutions for manufacturing, energy,
            material handling, and wider industrial sectors across the UK.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Engineering Services Built Around Specific UK Search Intent</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            UK buyers typically search for specific capabilities such as PLC programming,
            drive engineering, control panel design, or CRM and ERP projects.
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
            &ldquo;We solve practical industrial problems through specialist engineering services,
            from PLC and SCADA delivery through MV drive systems, electrical design,
            mechanical engineering, and connected CRM and ERP digital platforms.&rdquo;
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
