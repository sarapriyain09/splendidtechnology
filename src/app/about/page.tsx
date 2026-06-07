import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "react-qr-code";

export const metadata: Metadata = {
  title: "About Splendid Technology | Automation, Drive, Electrical and Digital Engineering",
  description:
    "Splendid Technology delivers specialist engineering services across Automation Engineering, Drive Systems Engineering, Electrical Engineering, Mechanical Engineering, and Digital Engineering for UK industry.",
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    title: "Automation Engineering",
    desc: "PLC programming, SCADA and HMI development, control system design, FAT support, commissioning, and network architecture for industrial systems.",
    href: "/services/automation-engineering",
  },
  {
    title: "Drive Systems Engineering",
    desc: "LV and MV AC drives, DC drives, AFE systems, common DC bus architecture, protection coordination, and integration support.",
    href: "/services/drive-systems-engineering",
  },
  {
    title: "Electrical Engineering",
    desc: "Detailed engineering outputs including single line diagrams, I/O lists, panel design, cable schedules, and protection studies.",
    href: "/services/electrical-engineering",
  },
  {
    title: "Mechanical Engineering",
    desc: "CAD design, FEA, reverse engineering, rapid prototyping, and manufacturing documentation for practical project delivery.",
    href: "/services/mechanical-engineering",
  },
  {
    title: "Digital Engineering",
    desc: "CRM and ERP solutions, warehouse management systems, supply chain digitalisation, and operational workflow automation.",
    href: "/services/digital-engineering",
  },
];

const detailedScope = [
  {
    heading: "Automation Engineering",
    points: [
      "PLC programming",
      "SCADA and HMI development",
      "Control system design",
      "FAT and commissioning support",
      "Network architecture",
      "Safety systems",
    ],
    href: "/services/automation-engineering",
  },
  {
    heading: "Drive Systems Engineering",
    points: [
      "LV and MV AC drives",
      "DC drives",
      "Common DC bus systems",
      "AFE rectifiers",
      "Soft starters and servo drives",
      "Renewable energy converters",
    ],
    href: "/services/drive-systems-engineering",
  },
  {
    heading: "Electrical Engineering",
    points: [
      "Detailed engineering",
      "Single line diagrams",
      "I/O lists",
      "Panel design",
      "Cable schedules",
      "Protection studies",
    ],
    href: "/services/electrical-engineering",
  },
  {
    heading: "Mechanical Engineering",
    points: [
      "CAD and design documentation",
      "FEA and simulation",
      "Reverse engineering",
      "Rapid prototyping",
      "DFM reviews",
      "Supplier-ready packs",
    ],
    href: "/services/mechanical-engineering",
  },
  {
    heading: "Digital Engineering",
    points: [
      "CRM solutions",
      "ERP solutions",
      "Warehouse management systems",
      "Supply chain digitalisation",
      "Workflow automation",
      "Management dashboards",
    ],
    href: "/services/digital-engineering",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">About Us</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Splendid Technology Ltd</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            An Industrial Technology &amp; Engineering Solutions company serving UK manufacturers nationwide —
            delivering Automation Engineering, Drive Systems Engineering, Electrical Engineering,
            Mechanical Engineering, and Digital Engineering solutions for industrial clients.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            Founded on 25+ years of rotating machinery and industrial systems expertise,
            we combine deep engineering delivery with practical digital systems that improve
            reliability, productivity, and operational visibility.
          </p>
        </div>
      </section>

      {/* Service Lines */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">What We Do</h2>
        <p className="mt-2 text-sm text-slate-500">Five specialist engineering service lines with detailed delivery scope.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-green-400 hover:shadow-md"
            >
              <h3 className="font-semibold text-[#0b1f3a] group-hover:text-green-700">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.desc}</p>
              <span className="mt-4 inline-block text-xs font-medium text-green-600 group-hover:underline">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Expanded Scope */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Expanded Engineering Scope</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Each service line includes concrete deliverables so clients can align technical scope,
            budget, and outcomes before implementation begins.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {detailedScope.map((scope) => (
              <div key={scope.heading} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-[#0b1f3a]">{scope.heading}</h3>
                <ul className="mt-4 space-y-2">
                  {scope.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 font-bold text-green-600">+</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href={scope.href} className="mt-5 inline-block text-xs font-semibold uppercase tracking-wide text-green-700 hover:underline">
                  View service details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">Our Approach</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                We focus on practical, engineering-driven solutions rather than generic platforms.
                Every project starts with understanding the real operational challenge &mdash; then
                we apply the right engineering and digital solution to solve it, whether that&rsquo;s
                automation controls, drive systems integration, electrical design outputs,
                mechanical engineering support, or CRM and ERP implementation.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Our team spans electrical engineering, software engineering, and business development
                &mdash; giving us end-to-end capability from plant-level systems through
                operational digital platforms used by engineering and management teams.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                For industrial clients, we handle <strong>full delivery support</strong> &mdash; scope definition,
                technical documentation, implementation planning, commissioning support,
                and ongoing optimisation to keep systems reliable and scalable.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">How We Work</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Rapid discovery and scope definition",
                  "Practical implementation with no over-engineering",
                  "Engineering documentation aligned to delivery",
                  "FAT, SAT and commissioning support",
                  "Clear technical visibility at every stage",
                  "Scalable architecture that grows with operations",
                  "Long-term reliability and optimisation support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-10 text-center sm:flex-row sm:text-left">
            <div className="shrink-0 rounded-xl bg-white p-4 shadow-sm">
              <QRCode
                value="https://splendidtechnology.co.uk"
                size={140}
                fgColor="#0b1f3a"
                bgColor="#ffffff"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600">Quick Access</p>
              <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">Scan to Visit Our Website</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Point your phone camera at the QR code to open{" "}
                <span className="font-medium text-[#0b1f3a]">splendidtechnology.co.uk</span>{" "}
                instantly &mdash; no typing required.
              </p>
              <p className="mt-1 text-xs text-slate-400">splendidtechnology.co.uk</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Work with us</h2>
          <p className="mt-3 text-slate-300">
            Whether you need a web app, an IoT monitoring system, a reliability study, or bespoke
            software &mdash; we&rsquo;d love to hear about your project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get in Touch
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
