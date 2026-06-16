import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industrial IoT for Manufacturers | Condition Monitoring UK | Splendid Technology",
  description:
    "Industrial IoT for manufacturers in the UK: condition monitoring, predictive maintenance, and asset intelligence for better reliability decisions.",
  alternates: { canonical: "/industries/industrial-iot-for-manufacturers" },
};

const faqs = [
  {
    q: "What is condition monitoring?",
    a: "Condition monitoring tracks asset behavior such as vibration, temperature, and load to detect early signs of failure.",
  },
  {
    q: "What is predictive maintenance?",
    a: "Predictive maintenance uses monitoring data and trend analysis to schedule interventions before major failures occur.",
  },
  {
    q: "What assets can be monitored?",
    a: "Motors, pumps, compressors, fans, conveyors, and other rotating or critical production assets.",
  },
];

export default function IndustryIoTManufacturersPage() {
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
          <h1 className="text-4xl font-bold sm:text-5xl">Industrial IoT for Manufacturers</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Improve asset reliability and reduce unplanned downtime through practical condition monitoring and predictive maintenance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/industrial-iot-for-manufacturers-uk" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">View IoT Solution</Link>
            <Link href="/contact" className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Request Site Review</Link>
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
