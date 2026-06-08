import { ContactForm } from "./ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Digitalization Assessment | Splendid Technology",
  description:
    "Book a digitalization assessment for your engineering or manufacturing business. We identify system bottlenecks and define a practical CRM, ERP, IoT, and engineering workflow roadmap.",
  keywords: [
    "engineering technology company uk",
    "engineering digitalization uk",
    "manufacturing digital transformation uk",
    "industrial iot solutions uk",
    "crm erp workflow automation uk",
    "digitalization assessment",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Book a Digitalization Assessment</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Tell us your goals, process bottlenecks, and systems currently in use. We work with
          engineering and manufacturing businesses across the UK to scope practical CRM, ERP,
          supply chain, IoT, and web app solutions.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <ContactForm />
        <p className="mt-6 text-xs leading-5 text-black/60">
          Tip: include your current tools, desired timeline, and the business outcomes you want
          to improve so we can define the right implementation roadmap.
        </p>
      </section>
    </div>
  );
}
