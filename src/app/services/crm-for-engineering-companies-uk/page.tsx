import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRM for Engineering Companies UK | Pipeline and Quote Workflow CRM",
  description:
    "CRM for engineering companies in the UK. Improve lead qualification, quote follow-up, pipeline control, and account visibility with practical CRM implementation.",
  keywords: [
    "engineering crm",
    "crm for engineering companies uk",
    "sales pipeline for engineering firms",
    "quote workflow crm",
    "b2b engineering lead management",
    "crm consultant uk",
  ],
  alternates: {
    canonical: "/services/crm-for-engineering-companies-uk",
  },
  openGraph: {
    type: "website",
    title: "CRM for Engineering Companies UK",
    description:
      "Practical CRM implementation for UK engineering businesses with complex B2B sales cycles.",
    url: "https://www.velynxia.com/services/crm-for-engineering-companies-uk",
  },
};

const outcomes = [
  "Structured enquiry and qualification workflow",
  "Faster quote follow-up and clearer ownership",
  "Pipeline visibility for technical and commercial teams",
  "Account growth tracking across key customers",
  "Better forecast confidence for leadership",
];

const implementation = [
  "Sales workflow mapping and stage design",
  "CRM field model for technical and commercial data",
  "Task automation and follow-up SLA setup",
  "Dashboard rollout for conversion and cycle-time KPIs",
  "Team adoption support and governance cadence",
];

const faqs = [
  {
    q: "Can this CRM handle technical sales processes?",
    a: "Yes. We design stages and fields for engineering sales cycles, including technical review, scope clarification, and quote governance.",
  },
  {
    q: "Can it integrate with our existing systems?",
    a: "Yes. We integrate with existing tools where practical and sequence integrations by business impact.",
  },
  {
    q: "Do you support migration from legacy systems?",
    a: "Yes. We migrate key account, pipeline, and activity data while cleaning structure and improving process clarity.",
  },
];

export default function CRMForEngineeringCompaniesUKPage() {
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
    name: "CRM for Engineering Companies UK",
    serviceType: "CRM implementation",
    provider: {
      "@type": "Organization",
      name: "Velynxia",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/crm-for-engineering-companies-uk",
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
            Engineering CRM
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            CRM for Engineering Companies in the UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            Improve engineering sales execution with practical CRM workflows for lead management,
            quote follow-up, and technical-commercial collaboration.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a CRM Assessment
            </Link>
            <Link
              href="/services/sales-crm"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View CRM Service
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Expected Outcomes</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {outcomes.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Implementation Scope</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {implementation.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/75">
                {item}
              </li>
            ))}
          </ul>
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
