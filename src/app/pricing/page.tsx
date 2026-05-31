import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Splendid Technology",
  description:
    "Affordable website pricing for UK tradespeople and small businesses. Starter websites from £199, monthly care plans from £15/month. Includes domain, hosting, SSL, and ongoing maintenance.",
  alternates: {
    canonical: "/pricing",
  },
};

const webTiers = [
  {
    name: "Starter Website",
    from: "£199",
    desc: "Perfect for sole traders, electricians, plumbers, and builders who need a professional online presence quickly.",
    features: [
      "3–5 pages (Home, About, Services, Contact)",
      "Mobile-friendly responsive design",
      "Contact form & Google Maps",
      "WhatsApp integration",
      "Domain registration included",
    ],
    cta: "Get a Quote",
    highlight: false,
  },
  {
    name: "Business Website",
    from: "£399",
    desc: "For established tradespeople and small businesses that need more pages, a gallery, and lead capture.",
    features: [
      "Up to 10 pages",
      "Gallery & portfolio section",
      "Lead capture & enquiry forms",
      "Google Analytics setup",
      "WhatsApp integration",
      "Domain registration included",
    ],
    cta: "Get a Quote",
    highlight: true,
  },
  {
    name: "Professional Website",
    from: "£599",
    desc: "A fully optimised site with SEO, blog, and everything you need to grow your online presence.",
    features: [
      "Up to 15 pages",
      "SEO setup & on-page optimisation",
      "Blog & news section",
      "Google Analytics & Search Console",
      "WhatsApp integration",
      "Domain registration included",
    ],
    cta: "Get a Quote",
    highlight: false,
  },
];

const appTiers = [
  {
    name: "Custom Portal / Web App",
    from: "£5,000",
    desc: "Bespoke web applications with user logins, dashboards, and integrations — built to your exact business logic.",
    features: [
      "User authentication & roles",
      "Database design & integration",
      "Reporting & data dashboards",
      "Third-party API integrations",
      "Cloud deployment & hosting",
    ],
    badge: null,
  },
  {
    name: "MVP SaaS Platform",
    from: "£10,000",
    desc: "A complete multi-user SaaS product — subscription billing, admin dashboard, and cloud infrastructure included.",
    features: [
      "Multi-user platform architecture",
      "Subscription & billing management",
      "Admin & analytics dashboard",
      "Cloud hosting & CI/CD setup",
      "Scalable from day one",
    ],
    badge: "Most Comprehensive",
  },
];

const supportTiers = [
  {
    name: "Monthly Care Plan",
    price: "£15/mo",
    features: [
      "Hosting & cloud infrastructure",
      "SSL certificate",
      "Security updates",
      "Monthly backups",
      "Uptime monitoring",
    ],
  },
  {
    name: "Business Care Plan",
    price: "£29/mo",
    features: [
      "Everything in Monthly Care",
      "Content updates (up to 30 min/month)",
      "Priority support",
    ],
  },
  {
    name: "Growth Care Plan",
    price: "£49/mo",
    features: [
      "Everything in Business Care",
      "Monthly SEO checks",
      "Google Business Profile support",
      "Up to 1 hour of changes/month",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">Pricing</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Transparent Starting Prices</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Every project is different &mdash; these are indicative starting prices to help you plan.
            Contact us for a free consultation and tailored quotation.
          </p>

          {/* Quick summary strip */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: "Starter Website", from: "From £199" },
              { label: "Business Website", from: "From £399" },
              { label: "Professional Website", from: "From £599" },
              { label: "Custom Web Apps", from: "From £5,000" },
              { label: "SaaS Development", from: "From £10,000" },
              { label: "Monthly Care Plan", from: "From £15/mo" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-0.5 text-sm font-bold text-green-400">{item.from}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Web Development */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Website Setup</h2>
        <p className="mt-2 text-sm text-slate-500">
          One-time setup fee. We handle everything &mdash; domain registration, cloud hosting, SSL certificate, and ongoing maintenance. No technical knowledge needed.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {webTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                tier.highlight
                  ? "border-green-500 bg-[#0b1f3a] text-white shadow-lg"
                  : "border-slate-200 bg-white"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-widest ${tier.highlight ? "text-green-400" : "text-slate-400"}`}>
                {tier.name}
              </p>
              <p className={`mt-2 text-3xl font-bold ${tier.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                {tier.from}
              </p>
              <p className={`mt-3 text-sm leading-6 ${tier.highlight ? "text-slate-300" : "text-slate-500"}`}>
                {tier.desc}
              </p>
              <ul className="mt-5 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? "text-slate-300" : "text-slate-700"}`}>
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-8 block rounded-full py-2.5 text-center text-sm font-semibold ${
                  tier.highlight
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-[#0b1f3a] text-[#0b1f3a] hover:bg-slate-50"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* All-in-One Bundle */}
      <section className="bg-green-50 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600">Best Value</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">Professional Website</h2>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-extrabold text-[#0b1f3a]">£199</span>
            <span className="text-lg text-slate-500">setup</span>
            <span className="text-2xl font-bold text-slate-400">+</span>
            <span className="text-4xl font-extrabold text-green-600">£19</span>
            <span className="text-lg text-slate-500">/month</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
            Low upfront cost, everything included. The easiest way to get your business online and keep it running.
          </p>
          <ul className="mt-8 inline-grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {[
              "3–5 Pages",
              "Mobile Friendly",
              "Contact Form & Google Maps",
              "WhatsApp Integration",
              "Domain Included",
              "Hosting Included",
              "SSL Certificate",
              "Ongoing Maintenance & Security Updates",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Apps & SaaS */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Custom Web Applications &amp; SaaS</h2>
          <p className="mt-2 text-sm text-slate-500">
            For complex platforms, portals, and multi-user SaaS products. Priced based on scope &mdash; these are indicative starting points.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {appTiers.map((tier) => (
              <div key={tier.name} className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {tier.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-[#0b1f3a]">
                    {tier.badge}
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tier.name}</p>
                <p className="mt-2 text-4xl font-bold text-[#0b1f3a]">{tier.from}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{tier.desc}</p>
                <ul className="mt-6 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-green-500">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-block rounded-full bg-[#0b1f3a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#162d50]"
                >
                  Discuss Your Project
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Monthly Care Plans</h2>
        <p className="mt-2 text-sm text-slate-500">
          Keep your website secure, fast, and up to date. All plans include hosting, SSL, and security updates. Feels like paying for a utility &mdash; and keeps your site running perfectly all year.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {supportTiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 ${i === 1 ? "border-green-400 bg-green-50" : "border-slate-200 bg-white"}`}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">{tier.name}</p>
              <p className="mt-2 text-3xl font-bold text-[#0b1f3a]">{tier.price}</p>
              <ul className="mt-5 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-6 block rounded-full border border-[#0b1f3a] py-2.5 text-center text-sm font-semibold text-[#0b1f3a] hover:bg-slate-50"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* IoT & Engineering — Quote Only */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
                IoT, Reliability &amp; Engineering Software
              </p>
              <h2 className="text-3xl font-bold">Priced on Enquiry</h2>
              <p className="mt-4 text-slate-300">
                Our Industrial IoT solutions, Reliability Engineering services, and SaaS products
                (Splendid Monitor, Splendid Reliability, Splendid Asset Manager) are scoped and
                priced individually &mdash; because hardware, installation complexity, and site
                conditions vary significantly between projects.
              </p>
              <p className="mt-3 text-slate-400 text-sm">
                Request a demo or get in touch and we&rsquo;ll provide a tailored quotation based on
                your assets, site, and objectives.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "IoT & Condition Monitoring", href: "/services/iot-solutions" },
                { label: "Reliability Engineering", href: "/services/reliability-engineering" },
                { label: "Splendid Monitor", href: "/products/splendid-monitor" },
                { label: "Splendid Reliability", href: "/products/splendid-reliability" },
                { label: "Splendid Asset Manager", href: "/products/splendid-asset-manager" },
                { label: "Splendid Accounting", href: "/products/splendid-accounting" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 hover:border-green-500/40"
                >
                  {item.label} &rarr;
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Request a Demo
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact Us for Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
