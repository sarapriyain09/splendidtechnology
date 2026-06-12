import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions | Splendid Technology",
  description:
    "Practical AI solutions for SMEs including workflow automation, AI assistants, CRM AI, and predictive insights.",
  alternates: {
    canonical: "/ai",
  },
};

const tracks = [
  {
    title: "AI Workflow Automation",
    body: "Automate repetitive internal tasks and business process handoffs.",
  },
  {
    title: "CRM AI",
    body: "Use AI-ready lead and customer data for smarter follow-up and sales execution.",
  },
  {
    title: "Predictive Insights",
    body: "Apply data-driven forecasting to operations and maintenance planning.",
  },
];

export default function AiPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            AI
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            AI Solutions for Real-World SME Operations
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We focus on practical AI implementation that improves speed, consistency,
            and decision support across sales and operations workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services/ai-solutions"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Explore AI Services
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Start an AI Pilot
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Implementation Tracks</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {tracks.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
