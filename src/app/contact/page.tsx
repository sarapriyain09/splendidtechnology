import { ContactForm } from "./ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Splendid Technology | UK-Wide Engineering & Software Solutions",
  description:
    "Contact Splendid Technology for Industry 4.0, engineering design, digital transformation, and software solutions across the UK. Get a fast, clear project estimate.",
  keywords: [
    "engineering technology company uk",
    "industrial iot solutions uk",
    "software development company uk",
    "digital transformation uk",
    "process automation uk",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Tell us what you want to build. We work with manufacturers and businesses across the entire UK. Share your goals, challenges, or early ideas — we&apos;ll help you scope the right solution.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <ContactForm />
        <p className="mt-6 text-xs leading-5 text-black/60">
          Tip: include your goals, timeline, and any links (CodLearn, docs, or
          examples) so we can scope accurately.
        </p>
      </section>
    </div>
  );
}
