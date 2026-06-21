import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Predictive Maintenance Solutions UK | Industrial SMEs | Velynxia",
  description:
    "Predictive maintenance solutions for UK manufacturers and industrial SMEs: condition monitoring, anomaly alerts, maintenance planning, and reliability improvement.",
  keywords: [
    "predictive maintenance solutions uk",
    "predictive maintenance manufacturing",
    "condition monitoring uk",
    "asset monitoring solutions uk",
  ],
  alternates: {
    canonical: "/services/predictive-maintenance-solutions-uk",
  },
};

const outcomes = [
  "Reduced unplanned downtime on critical assets",
  "Earlier detection of vibration and thermal anomalies",
  "Better maintenance planning with evidence-based decisions",
  "Clearer coordination between operations and engineering teams",
  "Improved reliability KPIs and lifecycle visibility",
];

const faqs = [
  {
    q: "What is predictive maintenance?",
    a: "Predictive maintenance uses asset condition data and trend analysis to intervene before failures become unplanned stoppages.",
  },
  {
    q: "What assets can be included?",
    a: "Motors, pumps, compressors, fans, and other rotating or critical production assets can be included based on priority.",
  },
  {
    q: "Can this start as a pilot?",
    a: "Yes. We typically start with high-risk assets, demonstrate impact, and then scale in phases.",
  },
];

export default function PredictiveMaintenanceSolutionsUKPage() {
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
    name: "Predictive Maintenance Solutions UK",
    serviceType: "Predictive maintenance implementation",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/predictive-maintenance-solutions-uk",
  };

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Predictive Maintenance
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Predictive Maintenance Solutions UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            Deploy practical predictive maintenance workflows based on condition monitoring,
            anomaly detection, and reliability-led maintenance planning.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Request Assessment
            </Link>
            <Link href="/services/industrial-iot-for-manufacturers-uk" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              View Industrial IoT Page
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
