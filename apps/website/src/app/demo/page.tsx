import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DemoCRM Access | CRM and AI Automation Demo",
  description:
    "Access DemoCRM and explore CRM, sales automation, customer management, and AI automation workflows.",
  keywords: [
    "demo crm",
    "crm automation demo",
    "sales automation demo",
    "customer management demo",
    "ai automation demo",
  ],
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-700">
          Live Access
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
          CRM Demo Portal
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Use the link below to access our CRM demo instance and review practical workflows for lead tracking, call management, and follow-up automation.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/">
            Homepage
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/sales-crm">
            CRM Solutions
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/ai-solutions">
            AI Automation
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/blog">
            Blog
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0b1f3a]">Open Demo Environment</h2>
            <p className="mt-1 text-sm text-black/60">
              URL: https://democrm.velynxia.com/
            </p>
          </div>
          <a
            href="https://democrm.velynxia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
          >
            Access CRM Demo
          </a>
        </div>
      </section>
    </div>
  );
}