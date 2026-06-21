import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRM for Manufacturers UK | CRM Implementation for Industrial SMEs",
  description:
    "CRM for manufacturers in the UK. Improve lead capture, quote follow-up, distributor management, and sales visibility with practical CRM implementation for industrial SMEs.",
  keywords: [
    "crm for manufacturers uk",
    "manufacturing crm software uk",
    "crm implementation manufacturing",
    "crm consultant uk",
    "b2b lead management crm",
    "sales crm for industrial companies",
  ],
  alternates: {
    canonical: "/services/crm-for-manufacturers-uk",
  },
  openGraph: {
    type: "website",
    title: "CRM for Manufacturers UK",
    description:
      "Practical CRM implementation for UK manufacturers and industrial SMEs.",
    url: "https://www.velynxia.com/services/crm-for-manufacturers-uk",
  },
};

const outcomes = [
  "Centralized lead capture from web, phone, and referrals",
  "Faster quote follow-up and fewer missed opportunities",
  "Clear pipeline visibility across sales reps and territories",
  "Better distributor and account relationship tracking",
  "Reliable sales forecasting and management reporting",
];

const scope = [
  "CRM process mapping and implementation",
  "Lead and enquiry routing workflows",
  "Quote and proposal automation",
  "Pipeline stage design for complex B2B deals",
  "Dashboards for conversion, cycle time, and revenue",
  "Integration with email, forms, and core systems",
];

const faqs = [
  {
    q: "Is this only for large manufacturers?",
    a: "No. This service is designed for UK manufacturing SMEs that need better commercial control without enterprise-level overhead.",
  },
  {
    q: "Can you migrate from spreadsheets or an old CRM?",
    a: "Yes. We migrate contacts, deal history, and process rules, then set up a cleaner CRM structure for your current operation.",
  },
  {
    q: "Do you support multi-site or distributor sales models?",
    a: "Yes. We can model distributor channels, key accounts, and regional workflows so reporting and ownership stay clear.",
  },
];

export default function CRMForManufacturersUKPage() {
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
    name: "CRM for Manufacturers UK",
    serviceType: "CRM implementation",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/crm-for-manufacturers-uk",
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
            Manufacturing CRM
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            CRM for Manufacturers in the UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            We help manufacturing and industrial SMEs implement CRM systems that improve lead
            management, quote response speed, and commercial visibility.
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
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Implement</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {scope.map((item) => (
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
                quote: "Lead and quote ownership is now clear across our commercial team.",
                role: "Sales Manager, UK Manufacturer",
              },
              {
                quote: "Follow-up consistency improved and we reduced missed opportunities.",
                role: "Director, Engineering SME",
              },
              {
                quote: "Pipeline reporting now supports reliable weekly decisions.",
                role: "Commercial Lead, Industrial SME",
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
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Request a Proposal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
