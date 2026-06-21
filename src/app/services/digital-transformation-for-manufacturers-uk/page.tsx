import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Transformation for Manufacturers UK | Practical Digitalisation for SMEs",
  description:
    "Digital transformation for UK manufacturers and industrial SMEs. Improve sales response, workflow visibility, and operational execution through practical digitalisation.",
  keywords: [
    "digital transformation manufacturing uk",
    "manufacturing digitisation uk",
    "digitalisation for manufacturers",
    "industrial workflow automation",
    "engineering digital transformation",
    "digital consultant uk",
  ],
  alternates: {
    canonical: "/services/digital-transformation-for-manufacturers-uk",
  },
  openGraph: {
    type: "website",
    title: "Digital Transformation for Manufacturers UK",
    description:
      "Practical digitalisation roadmaps and implementation for UK manufacturing SMEs.",
    url: "https://www.velynxia.com/services/digital-transformation-for-manufacturers-uk",
  },
};

const priorities = [
  "Enquiry-to-quote workflow clarity",
  "Operations and approval handoff control",
  "Data visibility across sales and delivery",
  "KPI reporting with weekly decision cadence",
  "Phased rollout with adoption support",
];

const phases = [
  "Assess bottlenecks and map current workflows",
  "Prioritize high-impact digitalisation use cases",
  "Implement first workflow with ownership and SLAs",
  "Add dashboards and process accountability",
  "Scale to adjacent workflows with governance",
];

const faqs = [
  {
    q: "Do you provide strategy only, or implementation as well?",
    a: "We provide both. Most engagements start with assessment and roadmap, then move into phased implementation and adoption support.",
  },
  {
    q: "Can this work for SMEs without enterprise budgets?",
    a: "Yes. We focus on practical sequencing so SMEs can start with one high-impact workflow and scale based on measurable outcomes.",
  },
  {
    q: "How long does a first digitalisation phase take?",
    a: "A first phase is typically scoped in weeks, not months, depending on process complexity and data readiness.",
  },
];

export default function DigitalTransformationForManufacturersUKPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Digital Transformation for Manufacturers UK",
    serviceType: "Digital transformation and workflow digitalisation",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/digital-transformation-for-manufacturers-uk",
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Manufacturing Digitalisation
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Digital Transformation for Manufacturers in the UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            We help UK manufacturing SMEs connect sales, operations, and workflow data to improve
            execution speed, visibility, and decision quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Digitalisation Assessment
            </Link>
            <Link
              href="/services/software-development"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Digitalisation Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Common Priority Areas</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {priorities.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Typical Delivery Phases</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {phases.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Client Proof and Trust</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                quote: "Our workflow handoffs are clearer, and status visibility is much better across teams.",
                role: "Operations Lead, Manufacturing SME",
              },
              {
                quote: "Phased implementation made adoption practical for our internal teams.",
                role: "Managing Director, Engineering Company",
              },
              {
                quote: "Weekly KPI reviews now give us faster and better-informed decisions.",
                role: "Commercial Director, UK SME",
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
              Read Case Studies
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-6 py-3 text-sm font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Founder and Team Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Frequently Asked Questions</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-base font-bold text-[#0b1f3a]">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-black/70">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
