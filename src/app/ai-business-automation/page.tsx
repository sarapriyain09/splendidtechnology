import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation for SMEs UK",
  description:
    "AI automation for UK SMEs: automate repetitive workflows, improve response times, and scale operations with practical implementation.",
  alternates: {
    canonical: "/ai-business-automation",
  },
};

export default function AiBusinessAutomationPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[#0b1f3a]">AI Business Automation for SMEs</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
        AI automation should reduce manual work and improve customer response speed. Start with
        high-volume, repetitive workflows and integrate them with CRM, email, and reporting.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          "Automated lead assignment and follow-up",
          "Email and SMS trigger workflows",
          "Assistant support for internal teams",
          "Reporting automation for faster decisions",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/75">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services/ai-solutions" className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3d91]">
          Explore AI Automation
        </Link>
        <Link href="/contact" className="rounded-lg border border-[#0b1f3a]/30 px-5 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5">
          Book Discovery Call
        </Link>
      </div>
    </main>
  );
}
