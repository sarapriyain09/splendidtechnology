import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industrial IoT for Manufacturers UK | Condition Monitoring and Predictive Maintenance",
  description:
    "Industrial IoT for UK manufacturers: condition monitoring, predictive maintenance, telemetry dashboards, and reliability-focused asset intelligence for industrial SMEs.",
  keywords: [
    "industrial iot for manufacturers uk",
    "condition monitoring uk",
    "predictive maintenance uk",
    "motor condition monitoring uk",
    "industrial telemetry dashboards",
    "reliability engineering digitalisation",
  ],
  alternates: {
    canonical: "/services/industrial-iot-for-manufacturers-uk",
  },
  openGraph: {
    type: "website",
    title: "Industrial IoT for Manufacturers UK",
    description:
      "Condition monitoring and predictive maintenance solutions for UK manufacturers.",
    url: "https://www.velynxia.com/services/industrial-iot-for-manufacturers-uk",
  },
};

const useCases = [
  "Monitoring motors, pumps, compressors, and rotating assets",
  "Early warning alerts for vibration and thermal anomalies",
  "Predictive maintenance planning with fewer emergency stoppages",
  "Site-level visibility for reliability and maintenance teams",
  "Energy and performance tracking for critical equipment",
];

const deliveryPhases = [
  "Site assessment and asset criticality mapping",
  "Sensor and data collection architecture",
  "Dashboard and alert workflow setup",
  "Reliability and maintenance KPI design",
  "Pilot rollout and scale plan across priority assets",
];

const faqs = [
  {
    q: "Can this be deployed in stages?",
    a: "Yes. We typically start with the highest-risk assets, validate ROI, and then scale monitoring to additional lines or sites.",
  },
  {
    q: "Do you support predictive maintenance dashboards?",
    a: "Yes. We deliver dashboards and alerting workflows that combine sensor data, asset context, and practical maintenance actions.",
  },
  {
    q: "Is this only for enterprise plants?",
    a: "No. Our approach is designed for UK industrial SMEs that need practical monitoring and reliability improvements without overengineering.",
  },
];

export default function IndustrialIoTForManufacturersUKPage() {
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
    name: "Industrial IoT for Manufacturers UK",
    serviceType: "Industrial IoT and condition monitoring",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.velynxia.com",
    },
    areaServed: "GB",
    url: "https://www.velynxia.com/services/industrial-iot-for-manufacturers-uk",
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
            Industrial IoT
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Industrial IoT for Manufacturers in the UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
            We help UK manufacturers implement condition monitoring and predictive maintenance
            workflows that reduce unplanned downtime and improve reliability decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Site Assessment
            </Link>
            <Link
              href="/services/iot-solutions"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View IoT Service
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Common Use Cases</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {useCases.map((item) => (
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
            {deliveryPhases.map((item) => (
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
                quote: "We moved from reactive maintenance to better-planned interventions on critical assets.",
                role: "Maintenance Lead, UK Industrial Site",
              },
              {
                quote: "The reliability dashboard gave both operations and engineering teams shared visibility.",
                role: "Operations Manager, Manufacturer",
              },
              {
                quote: "Pilot-first rollout helped us prove value before scaling across more lines.",
                role: "Engineering Director, SME",
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
              Request IoT Proposal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
