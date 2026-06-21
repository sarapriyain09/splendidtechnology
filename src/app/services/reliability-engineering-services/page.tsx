import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reliability Engineering Services | UK Industrial SMEs | Velynxia",
  description:
    "Reliability engineering services for UK manufacturers and industrial SMEs: asset criticality, failure analysis, maintenance strategy, and reliability KPI visibility.",
  keywords: [
    "reliability engineering services",
    "reliability engineering consultant uk",
    "asset reliability services uk",
    "maintenance strategy manufacturing",
  ],
  alternates: {
    canonical: "/services/reliability-engineering-services",
  },
};

const focusAreas = [
  "Asset criticality assessment and prioritization",
  "Failure mode review and reliability risk mapping",
  "Maintenance strategy aligned to asset criticality",
  "Reliability KPI dashboards and trend tracking",
  "Root-cause and corrective action workflow support",
];

const faqs = [
  {
    q: "What are reliability engineering services?",
    a: "They are structured methods to improve asset performance, reduce unplanned downtime, and align maintenance decisions with business risk.",
  },
  {
    q: "Is this suitable for SMEs?",
    a: "Yes. Our approach is designed for UK industrial SMEs and can be deployed in focused phases without large enterprise overhead.",
  },
  {
    q: "Can this integrate with IoT monitoring?",
    a: "Yes. Reliability workflows can integrate with condition monitoring and predictive maintenance data for stronger decisions.",
  },
];

export default function ReliabilityEngineeringServicesPage() {
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
    name: "Reliability Engineering Services",
    serviceType: "Reliability engineering consulting",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/reliability-engineering-services",
  };

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Reliability Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Reliability Engineering Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            Improve reliability performance through structured engineering analysis, practical maintenance strategy,
            and decision-ready operational visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Book Reliability Assessment
            </Link>
            <Link href="/services/reliability-engineering" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              View Core Reliability Service
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Focus Areas</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {focusAreas.map((item) => (
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
