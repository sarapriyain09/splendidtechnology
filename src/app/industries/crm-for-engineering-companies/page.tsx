import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRM for Engineering Companies | UK B2B Workflow CRM",
  description:
    "CRM for engineering companies in the UK. Improve lead qualification, quote tracking, and account visibility across technical sales teams.",
  alternates: { canonical: "/industries/crm-for-engineering-companies" },
};

const faqs = [
  {
    q: "Why is CRM important for engineering companies?",
    a: "Engineering sales cycles are technical and multi-stage. CRM improves ownership, follow-up consistency, and pipeline clarity.",
  },
  {
    q: "Can CRM support technical qualification?",
    a: "Yes. We configure stages for requirement capture, technical review, quote approval, and commercial follow-up.",
  },
  {
    q: "Will this integrate with existing tools?",
    a: "Yes. We connect CRM with email, web forms, and existing business systems where practical.",
  },
];

export default function IndustryCRMEngineeringPage() {
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
          <h1 className="text-4xl font-bold sm:text-5xl">CRM for Engineering Companies</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Purpose-built CRM workflows for engineering teams handling complex enquiries and technical quote cycles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/crm-for-engineering-companies-uk" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">View Engineering CRM</Link>
            <Link href="/contact" className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Book Consultation</Link>
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
