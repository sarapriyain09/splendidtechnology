import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Book a CRM and AI Automation Call | Splendid Technology",
  description:
    "Book a discovery call to discuss CRM implementation, AI automation, workflow systems, and integrations for your SME.",
  keywords: [
    "book crm demo uk",
    "ai automation consultation",
    "workflow automation discovery call",
    "sme crm partner",
    "twilio crm integration consultation",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[var(--background)]">
      <section className="border-b border-[#dce8ff] bg-[radial-gradient(circle_at_18%_22%,#dbe9ff_0%,#f5f8ff_55%,#ecfff8_100%)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-flex rounded-full border border-[#b6cbff] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1147bf]">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl">
            Book a CRM and AI Automation Discovery Call
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#37486e]">
            Share your current workflow bottlenecks, tools, and growth goals. We will map a practical implementation path with clear priorities.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-[#dce8ff] bg-white p-6 sm:p-8">
            <ContactForm />
          </div>

          <aside className="rounded-2xl border border-[#dce8ff] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0e1629]">What to Include</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#4d5d80]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#00a87f]">✓</span> Current CRM and communication tools</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#00a87f]">✓</span> Main lead and follow-up bottlenecks</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#00a87f]">✓</span> Workflows you want to automate first</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#00a87f]">✓</span> Desired timeline and implementation target</li>
            </ul>

            <div className="mt-6 rounded-xl border border-[#dce8ff] bg-[#f5f8ff] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Next Step</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">
                We review your request and respond with recommended next actions and a suggested scope.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
