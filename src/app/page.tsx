import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Web Apps, IoT Solutions, Reliability Engineering & Software | Splendid Technology UK",
  description:
    "Splendid Technology delivers Web Applications, SaaS Platforms, Industrial IoT Solutions, Reliability Engineering Software, and Digital Transformation Services for SMEs and industrial businesses across the UK.",
  keywords: [
    "web app development uk",
    "saas development uk",
    "industrial iot uk",
    "reliability engineering software uk",
    "smart motor monitoring uk",
    "predictive maintenance uk",
    "mtbf calculation tool uk",
    "business software development leicester",
    "digital transformation sme uk",
    "splendid accounting software",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology | Web Apps, IoT & Reliability Software",
    description:
      "Web Applications, SaaS Platforms, Industrial IoT Solutions and Reliability Engineering Software for UK SMEs and industrial businesses. Based in Leicester.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | Web Apps, IoT & Reliability Software",
    description:
      "Web Applications, SaaS Platforms, Industrial IoT Solutions and Reliability Engineering Software for UK SMEs and industrial businesses. Based in Leicester.",
  },
};

const solutions = [
  {
    title: "Web & App Development",
    description:
      "Business websites, SaaS applications, customer portals, mobile apps, and API integrations — built for performance and growth.",
    href: "/services/web-app-development",
    icon: "💻",
    tag: "Development",
    highlight: true,
  },
  {
    title: "IoT & Condition Monitoring",
    description:
      "Real-time motor health, vibration monitoring, energy tracking, and industrial IoT dashboards for UK manufacturers.",
    href: "/services/iot-solutions",
    icon: "📡",
    tag: "Industrial IoT",
  },
  {
    title: "Reliability Engineering",
    description:
      "MTBF analysis, FMEA/FMECA, RAM studies, and asset performance analytics — evidence-based engineering decisions.",
    href: "/services/reliability-engineering",
    icon: "⚙️",
    tag: "Engineering",
  },
  {
    title: "Splendid Accounting",
    description:
      "Purpose-built accounting software for SMEs. Asset accounting, job costing, and engineering business ERP.",
    href: "/products/splendid-accounting",
    icon: "📊",
    tag: "SaaS Product",
  },
  {
    title: "Splendid Monitor",
    description:
      "Industrial IoT dashboards, digital twins, and predictive alerts for motors, pumps, fans, and rotating plant.",
    href: "/products/splendid-monitor",
    icon: "🖥️",
    tag: "SaaS Product",
  },
  {
    title: "Splendid Reliability",
    description:
      "Track failures, calculate MTBF automatically, and optimise maintenance intervals across all your assets.",
    href: "/products/splendid-reliability",
    icon: "⏱️",
    tag: "Reliability Software",
  },
  {
    title: "AI Business Process Automation",
    description:
      "Eliminate repetitive manual work and human error with intelligent workflow automation. From data capture to reporting — fully automated.",
    href: "/services",
    icon: "🤖",
    tag: "Business Improvement",
  },
];

const benefits = [
  { icon: "💻", title: "Web & App Development", body: "From business websites to full SaaS platforms — fast delivery, clean code." },
  { icon: "📡", title: "IoT & Monitoring", body: "Real-time condition monitoring for motors, pumps, fans, and industrial plant." },
  { icon: "⚙️", title: "Reliability Engineering", body: "Evidence-based MTBF, FMEA and RAM analysis to extend asset life." },
  { icon: "📊", title: "Splendid Accounting", body: "SME accounting software with asset and job costing built in." },
  { icon: "🖥️", title: "Splendid Monitor", body: "Industrial IoT dashboards and digital twins for operational visibility." },
  { icon: "🤖", title: "AI Integrations", body: "Intelligent workflow automation and AI-powered business processes." },
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
              Web Apps, IoT&nbsp;&amp; Reliability Software for UK Business
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-7 text-white/80">
              Splendid Technology delivers Web Applications, SaaS Platforms, Industrial IoT
              Solutions, Reliability Engineering Software, and Digital Transformation Services
              for SMEs and industrial businesses.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Deliver</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Four revenue streams — Web &amp; App Development, Industrial IoT, Reliability
            Engineering, and SaaS Products — designed to help UK businesses grow and operate smarter.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            Four Ways We Help Your Business
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60">
            Web development that generates revenue today, IoT and reliability tools that
            protect your assets, and SaaS products that scale with you.
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

      {/* ── AI Process Automation Spotlight ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#f7f7f7] p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">Business Process Improvement</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a]">
                  AI Automation for Industrial Operations
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  Beyond hardware monitoring — we also automate the business processes
                  around your operations. Maintenance reporting, work order generation,
                  data capture, and operational dashboards. All automated. All connected.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Automated maintenance reports & alerts",
                    "AI-powered work order and scheduling",
                    "Operational data capture & digital forms",
                    "Management dashboards & KPI reporting",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 font-bold text-white transition-colors hover:bg-[#0b3d91]"
                  >
                    Explore AI Automation
                  </Link>
                </div>
              </div>
              <div className="grid w-full max-w-xs grid-cols-1 gap-3 lg:w-auto">
                {[
                  { icon: "📋", label: "Maintenance Reports" },
                  { icon: "📅", label: "Work Scheduling" },
                  { icon: "📈", label: "KPI Dashboards" },
                  { icon: "🔔", label: "Smart Alerts" },
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
              { heading: "Engineering Specialists", body: "Not a web agency — an engineering technology company with deep industrial expertise." },
              { heading: "Built for SMEs", body: "Affordable, scalable solutions sized for UK manufacturers — not enterprise-only pricing." },
              { heading: "UK-Based & Reliable", body: "Leicester-based team. On-site pilots, local support, and end-to-end project delivery." },
              { heading: "Results-Driven", body: "Every engagement is measured by reduced downtime, lower cost, and better operational data." },
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
          <h2 className="text-3xl font-bold">Ready to Improve Your Operations?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Book a free site visit or pilot. We assess your equipment and show you exactly
            what smart monitoring and AI automation can do for your business.
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
            <a className="underline hover:text-white" href="tel:+447721952967">
              +44 7721 952967
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
