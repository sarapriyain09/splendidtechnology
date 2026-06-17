import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "CRM and AI Automation Solutions for UK SMEs | Splendid Technology",
  description:
    "Splendid Technology helps UK SMEs implement CRM systems and AI automation workflows to improve sales response, customer management, and business operations.",
  keywords: [
    "crm for manufacturers uk",
    "crm for smes uk",
    "ai automation for smes",
    "ai workflow automation uk",
    "crm consultant uk",
    "manufacturing crm software",
    "splendid technology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "CRM and AI Automation Solutions for UK SMEs",
    description:
      "CRM implementation and AI automation for UK SMEs and manufacturers.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRM and AI Automation Solutions for UK SMEs",
    description:
      "CRM implementation and AI automation for UK SMEs and manufacturers.",
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
    title: "AI Automation",
    description:
      "Automate repetitive workflows, follow-up tasks, and reporting with practical AI-enabled processes.",
    href: "/services/ai-solutions",
    icon: "🧠",
    tag: "AI",
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
    title: "Smoother Team Handoffs",
    body: "CRM and workflow automation reduce internal delays across sales and operations teams.",
  },
  {
    icon: "📬",
    title: "Reliable Follow-Up",
    body: "Automated reminders and sequences reduce missed opportunities and no-response lead loss.",
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
    title: "AI Automation",
    href: "/services/ai-solutions",
    items: [
      "AI assistants for service and internal teams",
      "Workflow automation for repetitive tasks",
      "Email and SMS automation",
      "CRM integration with forms and call workflows",
      "AI-supported reporting and insights",
      "Pilot-to-rollout implementation support",
    ],
  },
];

const faqItems = [
  {
    question: "Do you provide CRM solutions for manufacturers in the UK?",
    answer:
      "Yes. We design and implement CRM systems for UK manufacturers, including lead capture, quote workflows, distributor management, and commercial reporting.",
  },
  {
    question: "What does AI automation include for an SME?",
    answer:
      "AI automation typically includes workflow automation, follow-up sequences, assistant-driven task support, and integrations between CRM, email, and reporting systems.",
  },
  {
    question: "Can AI automation work with our existing systems?",
    answer:
      "Yes. We integrate AI-assisted workflows with existing CRM, email, and operational systems so teams can automate repetitive work without replacing everything.",
  },
  {
    question: "Can you integrate CRM with our current tools?",
    answer:
      "Yes. We connect CRM with email, forms, call workflows, and reporting tools so your team can improve execution without replacing everything at once.",
  },
];

export default function Home() {
  const latestPosts = getAllBlogPosts().slice(0, 2);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Splendid Technology Ltd",
    url: "https://www.splendidtechnology.co.uk/",
    logo: "https://www.splendidtechnology.co.uk/images/brand/logo-splendid.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+44 7723 144910",
      email: "info@splendidtechnology.co.uk",
      areaServed: "GB",
      availableLanguage: ["en-GB"],
    },
    sameAs: [
      "https://www.linkedin.com/",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Splendid Technology Ltd",
    url: "https://www.splendidtechnology.co.uk/",
    areaServed: ["Leicester", "East Midlands", "United Kingdom"],
    telephone: "+44 7723 144910",
    email: "info@splendidtechnology.co.uk",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Splendid CRM",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Book a demo for pricing and rollout options",
    },
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.splendidtechnology.co.uk/",
    },
    url: "https://www.splendidtechnology.co.uk/services/sales-crm",
  };

  const homeServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        name: "CRM implementation for UK SMEs",
        serviceType: "CRM",
        areaServed: "GB",
        provider: {
          "@type": "Organization",
          name: "Splendid Technology Ltd",
        },
        url: "https://www.splendidtechnology.co.uk/services/sales-crm",
      },
      {
        "@type": "Service",
        name: "AI automation solutions for SMEs",
        serviceType: "AI automation",
        areaServed: "GB",
        provider: {
          "@type": "Organization",
          name: "Splendid Technology Ltd",
        },
        url: "https://www.splendidtechnology.co.uk/services/ai-solutions",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
              CRM and AI Automation for UK SMEs
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              CRM and AI Automation for Growing SMEs
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-7 text-white/80">
              Help SMEs improve sales, automate workflows, and build scalable digital systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://democrm.splendidtechnology.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white transition-colors hover:bg-green-700"
              >
                Try CRM Demo
              </a>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                Book a CRM Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Grid ── */}
      <section id="solutions" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Two Core Pillars: CRM and AI Automation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            We implement practical systems that improve sales execution, customer management,
            and business process automation for SMEs.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
            Every engagement is designed to help you track leads, improve follow-up,
            convert more enquiries, and reduce repetitive manual work.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Service Taxonomy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Two practical service categories for scaling SMEs and operational teams.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
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

      {/* ── SEO Landing Page Links ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Explore CRM and AI Topics</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
            Browse focused pages built around lead management, sales pipeline execution,
            and AI automation for SMEs.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/crm-for-engineering-companies", label: "CRM for Engineering Companies" },
              { href: "/lead-management-software", label: "Lead Management Software" },
              { href: "/sales-pipeline-management", label: "Sales Pipeline Management" },
              { href: "/call-management-crm", label: "Call Management CRM" },
              { href: "/ai-business-automation", label: "AI Business Automation" },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white"
              >
                {page.label} &rarr;
              </Link>
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
                  We focus on CRM and AI workflows that deliver visible business impact.
                  Start with one high-impact system and expand through measurable rollout phases.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Connected CRM, automation, and reporting workflows",
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
                  { icon: "🧠", label: "AI Automation" },
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
              { heading: "CRM and AI Focus", body: "Sales, customer, and automation workflows connected in one practical model." },
              { heading: "Implementation-Led Support", body: "Hands-on delivery for CRM setup, AI workflow rollout, and adoption." },
              { heading: "SME-Focused Execution", body: "Phased rollout aligned to practical budgets, team capacity, and quick business value." },
            ].map((item) => (
              <div key={item.heading} className="rounded-xl border border-black/10 bg-white p-6">
                <h3 className="font-bold text-[#0b1f3a]">{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof and Trust ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Proof and Trust Signals</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Evidence-led delivery matters. We focus on measurable workflow and reliability outcomes,
            with practical implementation for UK SMEs.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "Our sales process is now visible end-to-end, and follow-up discipline has improved significantly.",
                role: "Commercial Lead, UK Manufacturing SME",
              },
              {
                quote:
                  "Our follow-up workflows are now automated and response times improved across new enquiries.",
                role: "Operations Manager, UK SME",
              },
              {
                quote:
                  "The phased rollout made adoption easier and helped us show value quickly to leadership.",
                role: "Director, Engineering SME",
              },
            ].map((item) => (
              <article key={item.role} className="rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-sm leading-6 text-black/75">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">{item.role}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/engineering-case-studies"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 text-sm font-bold text-white hover:bg-[#0b3d91]"
            >
              View Case Studies
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-6 py-3 text-sm font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Meet the Team
            </Link>
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
                Practical guides on CRM implementation, lead management, and AI automation.
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
          <h2 className="text-3xl font-bold">Get a CRM and AI Roadmap in 14 Days</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            We assess your current systems, identify top bottlenecks, and propose a phased
            implementation plan with clear ROI checkpoints.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              Book Demo
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              View Services
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

      {/* ── FAQs ── */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Frequently Asked Questions</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Quick answers for teams planning CRM and AI automation implementation.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-base font-bold text-[#0b1f3a]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-black/70">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
