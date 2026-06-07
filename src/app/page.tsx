import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Industrial Automation, Drive Systems & Digital Engineering Solutions | Splendid Technology",
  description:
    "Delivering automation engineering, electrical design, drive systems engineering, CRM and ERP solutions for manufacturing, energy, material handling and industrial sectors.",
  keywords: [
    "industrial iot uk",
    "predictive maintenance uk",
    "reliability engineering uk",
    "condition monitoring uk",
    "smart motor monitoring uk",
    "cad design uk",
    "fea analysis uk",
    "engineering design leicester",
    "manufacturing solutions uk",
    "reverse engineering uk",
    "crm software uk",
    "business software development leicester",
    "digital transformation manufacturer uk",
    "splendid technology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology | Industry 4.0, Engineering & Software Solutions",
    description:
      "Industry 4.0 & Smart Manufacturing, Engineering & Product Development, Digital Transformation & Automation, and Software Solutions for UK manufacturers.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | Industry 4.0, Engineering & Software Solutions",
    description:
      "Industry 4.0 & Smart Manufacturing, Engineering & Product Development, Digital Transformation & Automation, and Software Solutions for UK manufacturers.",
  },
};

const solutions = [
  {
    title: "Automation Engineering",
    description:
      "PLC programming, SCADA and HMI development, control system design, FAT support, commissioning, and safety systems.",
    href: "/services/automation-engineering",
    icon: "⚙️",
    tag: "Automation",
    highlight: true,
  },
  {
    title: "Drive Systems Engineering",
    description:
      "LV and MV AC drives, DC drives, common DC bus architecture, AFE systems, and protection coordination.",
    href: "/services/drive-systems-engineering",
    icon: "⚡",
    tag: "Drives",
    highlight: true,
  },
  {
    title: "Electrical Engineering",
    description:
      "Detailed engineering, single line diagrams, I/O lists, panel design, cable schedules, and protection studies.",
    href: "/services/electrical-engineering",
    icon: "🔌",
    tag: "Electrical",
    highlight: true,
  },
  {
    title: "Digital Engineering",
    description:
      "CRM solutions, ERP solutions, warehouse management systems, and supply chain digitalisation for UK industry.",
    href: "/services/digital-engineering",
    icon: "💻",
    tag: "Digital",
    highlight: true,
  },
];

const benefits = [
  { icon: "⚙️", title: "PLC, SCADA and HMI Delivery", body: "Automation engineering services for new systems, upgrades, and production reliability improvements." },
  { icon: "⚡", title: "Drive Systems Expertise", body: "LV and MV drive engineering including DC drives, AFE systems, and common DC bus architecture." },
  { icon: "🔌", title: "Electrical Engineering Outputs", body: "SLDs, I/O lists, panel design, cable schedules, and protection studies built for project delivery." },
  { icon: "🔩", title: "Mechanical Engineering Support", body: "CAD, FEA, reverse engineering, and prototyping for practical design and manufacturing execution." },
  { icon: "📊", title: "Digital Engineering Platforms", body: "CRM, ERP, WMS, and supply chain digitalisation with operational dashboards and workflows." },
  { icon: "💻", title: "Integrated Delivery Approach", body: "Controls, drives, electrical, mechanical, and digital systems delivered by one coordinated team." },
];

const detailedScope = [
  {
    title: "Automation Engineering",
    href: "/services/automation-engineering",
    items: [
      "PLC programming",
      "SCADA and HMI development",
      "Control system design",
      "FAT and commissioning support",
      "Industrial network architecture",
      "Safety systems",
    ],
  },
  {
    title: "Drive Systems Engineering",
    href: "/services/drive-systems-engineering",
    items: [
      "LV and MV AC drives",
      "DC drives",
      "Common DC bus systems",
      "AFE rectifiers",
      "Soft starters and servo drives",
      "Renewable energy converters",
    ],
  },
  {
    title: "Electrical Engineering",
    href: "/services/electrical-engineering",
    items: [
      "Detailed engineering",
      "Single line diagrams",
      "I/O lists",
      "Panel design",
      "Cable schedules",
      "Protection studies",
    ],
  },
  {
    title: "Mechanical Engineering",
    href: "/services/mechanical-engineering",
    items: [
      "CAD design",
      "Manufacturing drawings",
      "FEA and simulation",
      "Reverse engineering",
      "Rapid prototyping",
      "DFM support",
    ],
  },
  {
    title: "Digital Engineering",
    href: "/services/digital-engineering",
    items: [
      "CRM solutions",
      "ERP solutions",
      "Warehouse management systems",
      "Supply chain digitalisation",
      "Workflow automation",
      "Operational dashboards",
    ],
  },
];

export default function Home() {
  const latestPosts = getAllBlogPosts().slice(0, 2);

  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
              Splendid Technology Ltd &mdash; Leicester, UK
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Industrial Automation, Drive Systems &amp; Digital Engineering Solutions
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-7 text-white/80">
              Delivering automation engineering, electrical design, drive systems engineering,
              CRM and ERP solutions for manufacturing, energy, material handling and
              industrial sectors across the UK.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white transition-colors hover:bg-green-700"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Grid ── */}
      <section id="solutions" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Specialist Engineering Services for UK Industry</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Structured around what buyers search for: automation engineering, drive systems,
            electrical engineering, mechanical delivery, and digital engineering projects.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className={`group flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                  s.highlight
                    ? "border-green-400 bg-[#0b1f3a] text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    s.highlight ? "bg-green-500/20 text-green-300" : "bg-[#0b1f3a]/10 text-[#0b1f3a]/60"
                  }`}>
                    {s.tag}
                  </span>
                </div>
                <h3 className={`mt-4 text-lg font-bold ${s.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {s.title}
                </h3>
                <p className={`mt-2 flex-1 text-sm leading-6 ${s.highlight ? "text-white/70" : "text-black/60"}`}>
                  {s.description}
                </p>
                <span className={`mt-5 text-sm font-semibold ${s.highlight ? "text-green-400" : "text-[#0b1f3a]"}`}>
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">
            Detailed Engineering Scope for Industrial Projects
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60">
            We do not position as generic engineering services. We deliver specialist scopes
            clients can search, evaluate, and procure with confidence.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4 rounded-xl bg-white/5 p-5">
                <span className="mt-0.5 text-2xl">{b.icon}</span>
                <div>
                  <p className="font-bold text-white">{b.title}</p>
                  <p className="mt-1 text-sm text-white/60">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expanded Engineering Scope ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Expanded Service Scope</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Five specialist lines with detailed deliverables for manufacturing, energy,
            material handling, and wider industrial sectors.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {detailedScope.map((scope) => (
              <div key={scope.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{scope.title}</h3>
                <ul className="mt-4 space-y-2">
                  {scope.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={scope.href} className="mt-5 inline-block text-sm font-semibold text-[#0b3d91] hover:underline">
                  View service details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Process Automation Spotlight ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#f7f7f7] p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">Digital Transformation &amp; Automation</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a]">
                  Automate, Digitalise &amp; Connect Your Operations
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  Beyond hardware monitoring — we digitalise and automate the business processes
                  around your operations. From workflow automation and data capture to
                  management dashboards and system integration. All connected. All measurable.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Automated maintenance reports & alerts",
                    "Workflow automation & digital forms",
                    "Data analytics & KPI dashboards",
                    "ERP, CRM & IoT system integration",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/services/software-development"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 font-bold text-white transition-colors hover:bg-[#0b3d91]"
                  >
                    Explore Digital Transformation
                  </Link>
                </div>
              </div>
              <div className="grid w-full max-w-xs grid-cols-1 gap-3 lg:w-auto">
                {[
                  { icon: "⚙️", label: "Process Automation" },
                  { icon: "📊", label: "Data Analytics" },
                  { icon: "🔗", label: "System Integration" },
                  { icon: "📱", label: "Digital Workflows" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-semibold text-[#0b1f3a]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Splendid Technology ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b1f3a]">
            Why Splendid Technology
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { heading: "Engineering Technology Partner", body: "Not a web agency — an engineering technology company with 25+ years of deep industrial IoT and manufacturing expertise." },
              { heading: "Five Engineering Service Lines", body: "Automation Engineering, Drive Systems Engineering, Electrical Engineering, Mechanical Engineering, and Digital Engineering." },
              { heading: "UK-Based & Reliable", body: "Leicester-based team. On-site pilots, local support, and end-to-end project delivery across the UK." },
              { heading: "Results-Driven", body: "Every engagement is measured by reduced downtime, lower manufacturing cost, and better operational data." },
            ].map((item) => (
              <div key={item.heading} className="rounded-xl border border-black/10 bg-white p-6">
                <h3 className="font-bold text-[#0b1f3a]">{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-[#0b1f3a]">Latest Insights</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-black/60">
                Practical guides on industrial IoT, predictive maintenance, and operational improvement.
              </p>
            </div>
            <Link className="text-sm font-medium text-[#0b3d91] hover:underline" href="/blog">
              View all posts
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {latestPosts.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-xs text-black/50">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0b1f3a]">
                  <Link className="hover:underline" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{post.description}</p>
                <Link
                  className="mt-4 inline-block text-sm font-medium text-[#0b3d91] hover:underline"
                  href={`/blog/${post.slug}`}
                >
                  Read post
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="contact" className="bg-[#0b1f3a] py-16 text-center text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Transform Your Operations?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Book a free consultation. We assess your challenges and show you exactly
            what our specialist engineering scope can do for your business.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              Book a Free Pilot
            </Link>
            <Link
              href="/industrial-iot"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              Explore Solutions
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50">
            <a className="underline hover:text-white" href="mailto:info@splendidtechnology.co.uk">
              info@splendidtechnology.co.uk
            </a>
            {"  |  "}
            <a className="underline hover:text-white" href="tel:+447723144910">
              +44 7723 144910
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
