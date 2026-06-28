import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Transformation for Manufacturers | UK SME Delivery",
  description:
    "Digital transformation for UK manufacturers: connect sales, operations, and asset workflows through practical phased implementation.",
  alternates: { canonical: "/industries/digital-transformation-for-manufacturers" },
};

const faqs = [
  {
    q: "What does digital transformation mean for manufacturers?",
    a: "It means connecting disconnected workflows across enquiry, operations, maintenance, and reporting to improve speed and visibility.",
  },
  {
    q: "Do we need a full ERP replacement?",
    a: "Not always. Most SMEs benefit from phased improvements that integrate with current systems before larger platform decisions.",
  },
  {
    q: "Can we start with one high-impact process?",
    a: "Yes. We usually begin with one bottleneck, validate outcomes, and then expand to adjacent workflows.",
  },
];

export default function IndustryDigitalTransformationManufacturersPage() {
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
          <h1 className="text-4xl font-bold sm:text-5xl">Digital Transformation for Manufacturers</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Practical transformation for UK industrial SMEs focused on measurable business outcomes, not buzzwords.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/digital-transformation-for-manufacturers-uk" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">View Solution</Link>
            <Link href="/contact" className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Discuss Roadmap</Link>
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
