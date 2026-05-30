import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales CRM Software UK | Custom CRM Development | Splendid Technology",
  description:
    "Custom Sales CRM solutions for UK SMEs — lead management, pipeline tracking, contact management, sales automation, and reporting dashboards. Built to fit your sales process.",
  keywords: [
    "sales crm uk",
    "custom crm development uk",
    "crm software leicester",
    "lead management software uk",
    "sales pipeline software uk",
    "bespoke crm uk",
    "crm for smes uk",
    "sales automation uk",
    "contact management software uk",
    "crm integration uk",
  ],
  alternates: {
    canonical: "/services/sales-crm",
  },
  openGraph: {
    type: "website",
    title: "Sales CRM Software UK | Splendid Technology",
    description:
      "Custom CRM solutions built for UK SMEs — manage leads, track pipelines, automate follow-ups, and close more deals.",
    url: "https://www.splendidtechnology.co.uk/services/sales-crm",
  },
};

const features = [
  {
    icon: "🎯",
    title: "Lead & Contact Management",
    desc: "Capture leads from web forms, email, and third-party sources. Centralise all contact history, notes, and activity in one place.",
  },
  {
    icon: "📊",
    title: "Visual Sales Pipeline",
    desc: "Kanban-style pipeline boards with drag-and-drop deal management. Track every deal through custom stages that match your sales process.",
  },
  {
    icon: "🔔",
    title: "Automated Follow-Ups",
    desc: "Set tasks, reminders, and automated email sequences so no lead ever falls through the cracks. Smart nudges keep your team on track.",
  },
  {
    icon: "📈",
    title: "Sales Reporting & Forecasting",
    desc: "Real-time dashboards showing pipeline value, conversion rates, team performance, and revenue forecasts — all in one view.",
  },
  {
    icon: "🔌",
    title: "Integrations & API",
    desc: "Connect your CRM to email platforms, accounting software, marketing tools, and existing business systems via REST APIs and webhooks.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    desc: "AI-driven lead scoring, deal probability predictions, and automated data enrichment to help your team focus on the best opportunities.",
  },
];

const benefits = [
  {
    icon: "⚡",
    title: "Built for Your Process",
    desc: "Unlike off-the-shelf CRMs, we build yours around your exact sales workflow — no forcing your team into someone else's system.",
  },
  {
    icon: "📦",
    title: "Full Data Ownership",
    desc: "Your data stays yours. No subscription lock-in, no per-seat charges that scale against you, no vendor dependency.",
  },
  {
    icon: "🔐",
    title: "Secure & Compliant",
    desc: "GDPR-ready by design. Role-based access control, audit logging, data encryption, and secure UK hosting available.",
  },
  {
    icon: "📱",
    title: "Mobile & Field Sales Ready",
    desc: "Fully responsive web app and optional mobile app for field sales teams — update deals, log calls, and capture leads on the go.",
  },
];

const useCases = [
  "B2B sales teams managing complex deal cycles",
  "Field sales reps capturing leads on-site",
  "Service businesses quoting and following up on enquiries",
  "Agencies managing client pipelines and retainers",
  "Manufacturing companies tracking distributor relationships",
  "Engineering businesses managing project bids and tenders",
];

const techStack = [
  "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL",
  "Supabase", "Prisma", "Resend", "Stripe", "Vercel", "AWS",
];

export default function SalesCRMPage() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — Sales CRM
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Custom Sales CRM for UK Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Stop fitting your sales team into a generic CRM. We build bespoke Sales CRM software
            tailored to your pipeline, your process, and your people — so your team spends less
            time on admin and more time closing deals.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              Get a Free CRM Consultation
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-black/10 bg-white py-8">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { stat: "100%", label: "Built to your spec" },
              { stat: "GDPR", label: "Compliant by design" },
              { stat: "UK", label: "Based team" },
              { stat: "0", label: "Per-seat licence fees" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-green-600 sm:text-3xl">{item.stat}</p>
                <p className="mt-1 text-xs text-black/50 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Screenshot ── */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600">See It in Action</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Splendid CRM — Built by Us, Used by UK Teams</h2>
            <p className="mt-3 text-sm leading-6 text-black/60 max-w-2xl mx-auto">
              A real-world example of a custom CRM we&apos;ve built — featuring a live dashboard with pipeline snapshots,
              lead management, deal tracking, and hot lead indicators. All tailored to the client&apos;s sales process.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 shadow-xl">
            <Image
              src="/images/projects/CRM.png"
              alt="Splendid CRM dashboard showing pipeline snapshot, lead stats, and deal tracking"
              width={1440}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🎯", label: "Lead Generator" },
              { icon: "📊", label: "Pipeline View" },
              { icon: "💬", label: "Quotes & Tasks" },
              { icon: "⚙️", label: "Settings & Roles" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#0b1f3a] shadow-sm">
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">What We Build</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">CRM Features Built Around Your Sales Process</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Every CRM we build is unique — but these are the core modules we deliver for sales teams across the UK.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">Who It&apos;s For</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Perfect for UK SMEs with Active Sales Teams</h2>
              <p className="mt-3 text-sm leading-6 text-black/60">
                Our custom CRM solutions are ideal for businesses that have outgrown spreadsheets and generic tools,
                or whose sales process doesn&apos;t fit neatly into off-the-shelf software.
              </p>
              <ul className="mt-6 space-y-3">
                {useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="mt-0.5 font-bold text-green-600">✔</span> {uc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="mt-3 text-sm font-bold text-[#0b1f3a]">{b.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-black/60">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Our CRM Technology Stack</h2>
          <p className="mt-2 text-sm text-black/50">Modern, maintainable, and built to scale with your business.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {techStack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#0b1f3a] shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">Our Process</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">How We Build Your CRM</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Discovery", desc: "We map your sales process, understand your team's workflow, and define exactly what your CRM needs to do." },
              { step: "02", title: "Design", desc: "Wireframes and UI prototypes are shared for feedback before a single line of code is written." },
              { step: "03", title: "Build & Test", desc: "We build iteratively with regular demos. You see progress weekly — not just at the end." },
              { step: "04", title: "Launch & Support", desc: "Smooth go-live with team training, data migration support, and ongoing maintenance if needed." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-green-600/30">{item.step}</p>
                <h3 className="mt-2 text-base font-bold text-[#0b1f3a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Get Started</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-white">
              Ready to replace your spreadsheets with a CRM that actually fits?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Book a free 30-minute consultation with our team. We&apos;ll scope your CRM requirements,
              walk you through what&apos;s possible, and provide a no-obligation quote.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Fixed-price or milestone-based projects",
                "UK-based team — no offshore handoffs",
                "Full ownership of source code & data",
                "GDPR-compliant from day one",
                "Integrates with your existing tools",
                "Post-launch support & enhancements",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="font-bold text-green-400">✔</span> {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
              >
                Book a Free CRM Consultation
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
