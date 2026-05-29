import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Splendid Technology",
  description:
    "Transparent 'starting from' pricing for web development, custom web applications, SaaS development, and ongoing support. IoT and reliability engineering solutions priced on enquiry.",
  alternates: {
    canonical: "/pricing",
  },
};

const webTiers = [
  {
    name: "Starter Website",
    from: "£750",
    desc: "Perfect for small businesses, sole traders, and professionals who need a clean, fast online presence.",
    features: [
      "Up to 5 pages",
      "Mobile responsive design",
      "Contact form",
      "Basic on-page SEO",
      "2-week delivery",
    ],
    cta: "Get a Quote",
    highlight: false,
  },
  {
    name: "Business Website",
    from: "£1,500",
    desc: "For growing businesses that need a content-rich, SEO-optimised site with a blog and analytics.",
    features: [
      "Up to 15 pages",
      "Content management system",
      "Blog & news section",
      "Google Analytics setup",
      "Full SEO configuration",
    ],
    cta: "Get a Quote",
    highlight: true,
  },
  {
    name: "E-Commerce Website",
    from: "£2,500",
    desc: "Sell online with a fully managed store, payment gateway, and order management built in.",
    features: [
      "Online product catalogue",
      "Payment gateway integration",
      "Product & inventory management",
      "Order & customer management",
      "Mobile-first checkout",
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
      "Cloud deployment (Vercel / AWS)",
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
    name: "Essential",
    price: "£99/mo",
    features: ["Security updates", "Uptime monitoring", "Monthly backups", "Email support"],
  },
  {
    name: "Professional",
    price: "£199/mo",
    features: ["Everything in Essential", "Content updates (2hr/mo)", "Performance reviews", "Priority support"],
  },
  {
    name: "Business",
    price: "£299/mo",
    features: ["Everything in Professional", "Development hours (4hr/mo)", "SEO monitoring", "Dedicated account manager"],
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
              { label: "Website Development", from: "From £750" },
              { label: "E-Commerce", from: "From £2,500" },
              { label: "Custom Web Apps", from: "From £5,000" },
              { label: "SaaS Development", from: "From £10,000" },
              { label: "Support & Maintenance", from: "From £99/mo" },
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
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Website Development</h2>
        <p className="mt-2 text-sm text-slate-500">
          All websites are built with Next.js, fully mobile responsive, and deployed to fast global CDN infrastructure.
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
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Ongoing Support &amp; Maintenance</h2>
        <p className="mt-2 text-sm text-slate-500">
          Keep your website or web app secure, up to date, and performing &mdash; without managing it yourself.
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
