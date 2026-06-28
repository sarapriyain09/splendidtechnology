import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRM for Manufacturers UK | Industry Solutions",
  description:
    "Industry page for CRM for manufacturers in the UK. Improve enquiry capture, quote follow-up, and pipeline visibility with practical implementation for industrial SMEs.",
  alternates: { canonical: "/industries/crm-for-manufacturers-uk" },
};

const faqs = [
  {
    q: "What is CRM for manufacturers?",
    a: "A CRM setup tailored for industrial sales cycles, including enquiry tracking, technical qualification, quote stages, and follow-up management.",
  },
  {
    q: "How long does implementation take?",
    a: "Most SMEs can launch a practical phase in 4 to 8 weeks, then expand dashboards and automation in staged rollouts.",
  },
  {
    q: "Can this work with engineering quote workflows?",
    a: "Yes. We map technical reviews, commercial approvals, and quote follow-up steps to improve response speed and conversion consistency.",
  },
];

export default function IndustryCRMManufacturersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold sm:text-5xl">CRM for Manufacturers UK</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Built for industrial enquiry-to-quote workflows, distributor channels, and B2B pipeline visibility.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/crm-for-manufacturers-uk" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">View Solution</Link>
            <Link href="/contact" className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Book Assessment</Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Frequently Asked Questions</h2>
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
