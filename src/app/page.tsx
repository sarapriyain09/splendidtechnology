import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Digitalisation, CRM, Web Apps and AI Solutions for UK SMEs | Splendid Technology",
  description:
    "Splendid Technology is a digital company helping UK SMEs implement CRM, workflow automation, SaaS and web applications, AI-enabled processes, and connected business systems.",
  keywords: [
    "digitalisation services uk",
    "crm for smes uk",
    "workflow automation uk",
    "saas development company uk",
    "web app development uk",
    "ai solutions for small business uk",
    "business systems integration uk",
    "splendid technology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Digitalisation, CRM, Web Apps and AI Solutions for UK SMEs",
    description:
      "CRM, business systems, SaaS platforms, AI automation, and web app development for UK SMEs.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitalisation, CRM, Web Apps and AI Solutions for UK SMEs",
    description:
      "CRM, workflow automation, SaaS and AI-enabled web apps for UK SMEs.",
  },
};

const solutions = [
  {
    title: "CRM",
    description:
      "Lead capture, pipeline workflows, customer lifecycle tracking, and commercial dashboards.",
    href: "/services/sales-crm",
    icon: "📈",
    tag: "CRM",
    highlight: true,
  },
  {
    title: "Digitisation",
    description:
      "Digitise operations, approvals, reporting, and system handoffs across business workflows.",
    href: "/services/software-development#workflow",
    icon: "🧩",
    tag: "Digitisation",
    highlight: true,
  },
  {
    title: "SaaS",
    description:
      "Build scalable SaaS products, customer portals, and internal web platforms for growth.",
    href: "/services/web-app-development",
    icon: "💻",
    tag: "SaaS",
    highlight: true,
  },
  {
    title: "AI Solutions",
    description:
      "Apply AI to automate repetitive processes, improve response speed, and enhance decision support.",
    href: "/services/ai-solutions",
    icon: "🧠",
    tag: "AI",
    highlight: true,
  },
  {
    title: "Connected Data and Asset Intelligence",
    description:
      "Capture connected asset data, improve visibility with dashboards, and generate predictive insights for smarter operations.",
    href: "/services/iot-solutions",
    icon: "📡",
    tag: "IoT/Data",
    highlight: true,
  },
];

const benefits = [
  {
    icon: "⏱️",
    title: "Faster Commercial Response",
    body: "Digitized CRM and quote workflows reduce lead follow-up lag and improve conversion speed.",
  },
  {
    icon: "🏭",
    title: "Connected Operations",
    body: "Job, inventory, warehouse, and reporting workflows stay aligned across teams and systems.",
  },
  {
    icon: "🔧",
    title: "Reduced Downtime",
    body: "Connected asset data and predictive insights improve reliability planning and execution.",
  },
  {
    icon: "📊",
    title: "Decision-Ready Data",
    body: "Unified dashboards provide actionable KPIs for sales, operations, and engineering leaders.",
  },
  {
    icon: "🤝",
    title: "Implementation-Led Delivery",
    body: "Each phase is scoped for practical rollout, team adoption, and measurable business impact.",
  },
  {
    icon: "📈",
    title: "Scalable Growth Platform",
    body: "Start with one high-impact workflow, then expand into a connected digital operating model.",
  },
];

const whoWeHelp = [
  "Manufacturers",
  "Engineering SMEs",
  "Accountants",
  "Professional Services Firms",
  "Growing SMEs",
];

const detailedScope = [
  {
    title: "CRM",
    href: "/services/sales-crm",
    items: [
      "CRM implementation and migration",
      "Lead capture and pipeline workflows",
      "Quote and customer process automation",
      "Sales dashboarding and reporting",
      "Follow-up automation",
      "Commercial data standardization",
    ],
  },
  {
    title: "Digitisation",
    href: "/services/software-development#workflow",
    items: [
      "Job and work-order tracking",
      "Approval workflow automation",
      "Operational dashboards",
      "System integration across core tools",
      "Process mapping and optimization",
      "Data standardization and reporting",
    ],
  },
  {
    title: "SaaS",
    href: "/services/web-app-development",
    items: [
      "Custom SaaS product development",
      "Customer and partner portals",
      "Internal workflow apps",
      "API and platform integrations",
      "Scalable architecture and delivery",
      "Post-launch support and iteration",
    ],
  },
  {
    title: "AI Solutions",
    href: "/services/ai-solutions",
    items: [
      "AI-assisted process automation",
      "Intelligent lead and enquiry routing",
      "AI-supported reporting and insights",
      "Operational recommendation workflows",
      "Assistive copilots for internal teams",
      "AI readiness and implementation planning",
    ],
  },
  {
    title: "Connected Data and Asset Intelligence",
    href: "/services/iot-solutions",
    items: [
      "Connected data collection pipelines",
      "Telemetry and asset visibility dashboards",
      "Cross-site reporting and KPI tracking",
      "Predictive insights and anomaly detection",
      "Alerting and escalation workflows",
      "Reliability and performance reporting",
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
              CRM, SaaS and Digitalisation for UK SMEs
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Digitalisation, CRM, Web Apps and AI Solutions for UK SMEs
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-7 text-white/80">
              We are a digital company helping UK SMEs improve sales response, streamline
              operations, and scale with practical CRM, web applications, AI, and connected business systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white transition-colors hover:bg-green-700"
              >
                Book a Digitalization Assessment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Grid ── */}
      <section id="solutions" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">One Connected Digital Layer Across Sales, Operations, and Assets</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            We design and implement practical systems that connect commercial workflows,
            operations data, connected asset data, and web applications in one environment.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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

      {/* ── Who We Help ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Who We Help</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            We support teams that need clearer visibility, better process control, and scalable
            digital systems to improve performance.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {whoWeHelp.map((group) => (
              <div
                key={group}
                className="rounded-xl border border-black/10 bg-white px-4 py-5 text-center"
              >
                <p className="text-sm font-semibold text-[#0b1f3a]">{group}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">
            Business Outcomes, Not Technical Vanity Metrics
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60">
            Every engagement is designed to improve commercial speed, operational visibility,
            reliability, and decision quality.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Digitalization Service Taxonomy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Five practical service categories for scaling SMEs and operational teams.
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
                <p className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">Differentiation</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a]">
                  Practical Systems, Clear Outcomes, and Phased Rollout.
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  We focus on connected digital workflows that deliver visible business impact.
                  Start with one high-impact system and expand through measurable rollout phases.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Connected CRM, ERP, data visibility, and reporting",
                    "Phased rollout model with measurable outcomes",
                    "Designed for SME budgets and operational realities",
                    "Implementation support from discovery through adoption",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 font-bold text-white transition-colors hover:bg-[#0b3d91]"
                  >
                    Get Your 14-Day Roadmap
                  </Link>
                </div>
              </div>
              <div className="grid w-full max-w-xs grid-cols-1 gap-3 lg:w-auto">
                {[
                  { icon: "📈", label: "CRM" },
                  { icon: "🧩", label: "Digitisation" },
                  { icon: "💻", label: "SaaS" },
                  { icon: "🧠", label: "AI Solutions" },
                  { icon: "📡", label: "IoT and Data" },
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
              { heading: "Outcome-Led Delivery", body: "We prioritize measurable business outcomes over isolated technical deliverables." },
              { heading: "Cross-Functional Digitalization", body: "Sales, operations, and customer workflows connected in one practical model." },
              { heading: "Industry-Aware Digitalisation", body: "Experience supporting manufacturing and industrial SMEs through CRM, ERP, IoT, and business systems." },
              { heading: "SME-Focused Execution", body: "Phased deployment model aligned to practical budgets, team capacity, and rapid value realization." },
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
                Practical guides on CRM, digitalisation, automation, and web app delivery.
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
          <h2 className="text-3xl font-bold">Get a Digitalization Roadmap in 14 Days</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            We assess your current systems, identify top bottlenecks, and propose a phased
            implementation plan with clear ROI checkpoints.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              Book a Digitalization Assessment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              View Solution Categories
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
