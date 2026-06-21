import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI for Manufacturing SMEs | Practical Automation UK",
  description:
    "AI for manufacturing SMEs in the UK: automate enquiry triage, workflow routing, and operational reporting with practical implementation.",
  alternates: { canonical: "/industries/ai-for-manufacturing-smes" },
};

const faqs = [
  {
    q: "Where can AI help first in manufacturing SMEs?",
    a: "Most teams start with enquiry triage, repetitive admin tasks, and reporting workflows where speed and consistency matter.",
  },
  {
    q: "Do we need large AI infrastructure?",
    a: "No. We design lightweight, practical AI workflows integrated with your current systems.",
  },
  {
    q: "How is risk controlled?",
    a: "We define human approval points, audit trails, and staged deployment to keep AI outputs reliable and accountable.",
  },
];

export default function IndustryAIManufacturingPage() {
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
          <h1 className="text-4xl font-bold sm:text-5xl">AI for Manufacturing SMEs</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Apply AI where it drives operational value: faster response times, cleaner workflows, and better decisions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/ai-solutions" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">View AI Solutions</Link>
            <Link href="/contact" className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Book Discovery Call</Link>
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
