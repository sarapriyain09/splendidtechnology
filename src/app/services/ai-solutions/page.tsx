import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for SMEs UK | AI Business Automation | Splendid Technology",
  description:
    "AI Solutions for SMEs in the UK: AI assistants, CRM AI, document processing, quotation generation, knowledge bases, and customer support AI.",
  keywords: [
    "ai solutions for smes",
    "ai business automation uk",
    "ai workflow automation",
    "crm ai uk",
    "ai customer support uk",
    "ai assistants for business",
    "document processing ai",
    "quotation generation ai",
    "knowledge base ai",
  ],
  alternates: {
    canonical: "/services/ai-solutions",
  },
  openGraph: {
    type: "website",
    title: "AI Solutions for SMEs UK | Splendid Technology",
    description:
      "Practical AI solutions for UK SMEs including assistants, CRM AI, document automation, quotation generation, and support AI.",
    url: "https://www.splendidtechnology.co.uk/services/ai-solutions",
  },
};

const capabilities = [
  {
    icon: "🤝",
    title: "AI Assistants",
    desc: "Deploy AI assistants to help teams with repetitive tasks, internal queries, and day-to-day process execution.",
  },
  {
    icon: "📈",
    title: "CRM AI",
    desc: "Prioritize leads, automate follow-up prompts, and improve opportunity visibility with AI-powered CRM workflows.",
  },
  {
    icon: "📄",
    title: "Document Processing",
    desc: "Extract and structure data from forms, emails, and PDFs to reduce manual admin and speed up operations.",
  },
  {
    icon: "🧾",
    title: "Quotation Generation",
    desc: "Generate draft quotations from structured data and standard pricing rules, then route for review and approval.",
  },
  {
    icon: "📚",
    title: "Knowledge Bases",
    desc: "Create searchable internal knowledge systems so teams can find policies, process notes, and answers instantly.",
  },
  {
    icon: "💬",
    title: "Customer Support AI",
    desc: "Improve response speed and consistency with AI-assisted customer support workflows across channels.",
  },
];

const outcomes = [
  "Faster response times across sales and support",
  "Less manual admin for operational teams",
  "More consistent process execution",
  "Better reporting and decision visibility",
  "Scalable workflows without proportional headcount growth",
];

export default function AISolutionsPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - AI Solutions
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            AI Solutions for SMEs
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We design practical AI systems for UK SMEs to automate business workflows,
            improve customer response, and increase operational visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book an AI Discovery Call
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What We Deliver</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            AI implementations focused on measurable business outcomes, not hype.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">Outcomes</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">How AI Improves Your SME Operations</h2>
              <ul className="mt-6 space-y-3">
                {outcomes.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="mt-0.5 font-bold text-green-600">✔</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">Implementation Model</p>
              <h3 className="mt-2 text-xl font-bold text-[#0b1f3a]">Pilot First, Then Scale</h3>
              <p className="mt-3 text-sm leading-6 text-black/60">
                We start with one high-impact AI workflow, validate results, and then expand
                into connected CRM, operations, and support processes.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-6 py-3 text-sm font-bold text-white hover:bg-[#0b3d91]"
                >
                  Start Your AI Pilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
