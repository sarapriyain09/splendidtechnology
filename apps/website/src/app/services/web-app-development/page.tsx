import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web & App Development Services UK",
  description:
    "Professional Web & App Development for UK businesses — business websites, SaaS applications, customer portals, mobile apps, API integrations, and AI-powered solutions. Based in Leicester.",
  keywords: [
    "web developer Leicester",
    "software developer Leicester",
    "web developer Birmingham",
    "web developer London",
    "SaaS development UK",
    "custom web applications UK",
    "website hosting for SMEs",
    "web app development uk",
    "saas development uk",
    "business website development leicester",
    "customer portal development uk",
    "mobile app development uk",
    "api development uk",
    "bespoke software development uk",
    "cloud solution development uk",
  ],
  alternates: {
    canonical: "/services/web-app-development",
  },
};

const offerings = [
  {
    icon: "🌐",
    title: "Business Websites",
    desc: "Fast, conversion-focused websites built on Next.js or WordPress — SEO-optimised, mobile-first, and easy to manage.",
  },
  {
    icon: "☁️",
    title: "SaaS Applications",
    desc: "Full-stack SaaS platforms with multi-tenant architecture, subscription billing, user management, and analytics dashboards.",
  },
  {
    icon: "🔐",
    title: "Customer Portals",
    desc: "Secure self-service portals for your clients — order tracking, document access, support, and account management.",
  },
  {
    icon: "📱",
    title: "Mobile Apps",
    desc: "Cross-platform mobile apps for iOS and Android using React Native — from field engineer tools to customer-facing apps.",
  },
  {
    icon: "🔌",
    title: "API Development",
    desc: "RESTful and GraphQL APIs, third-party integrations, webhooks, and data pipelines connecting your tools and services.",
  },
  {
    icon: "🤖",
    title: "AI Integrations",
    desc: "Embed AI into your existing products — chatbots, document analysis, intelligent automation, and predictive features.",
  },
];

const techStack = [
  "Next.js", "React", "TypeScript", "Node.js", "Python",
  "PostgreSQL", "Supabase", "Stripe", "Vercel", "AWS",
];

export default function WebAppDevelopmentPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services — Web &amp; App Development
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Web &amp; App Development for UK Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            From business websites to full SaaS platforms — we build digital products that
            generate revenue, serve your customers, and scale with your business. Fast delivery,
            clean code, and no vendor lock-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Build</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Web development is often the fastest way to generate revenue while your
            SaaS and IoT products mature.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <div key={o.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{o.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{o.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-[#f7f7f7] py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Our Technology Stack</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {techStack.map((t) => (
              <span key={t} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#0b1f3a]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Splendid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0b1f3a] p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">Why Choose Us</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-white">
              Engineering-grade development for real businesses
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              We&apos;re engineers first, developers second. Every product we build is designed
              for performance, security, and long-term maintainability — not just to ship fast.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Fixed-price or milestone-based projects",
                "UK-based team — no offshore handoffs",
                "Full ownership of code and IP",
                "Post-launch support & maintenance",
                "Security-first development (OWASP)",
                "Integrates with IoT & reliability tools",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="font-bold text-green-400">✔</span> {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Discuss Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
