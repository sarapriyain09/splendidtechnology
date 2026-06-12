import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Splendid Technology",
  description:
    "Case studies showing how Splendid Technology delivers measurable outcomes across engineering, CRM, digitalisation, and AI solutions.",
  alternates: {
    canonical: "/case-studies",
  },
};

const caseStudyGroups = [
  {
    title: "Engineering Case Studies",
    body: "Applied analysis and implementation work in structural dynamics, rotor dynamics, and industrial systems.",
    href: "/engineering-case-studies",
    cta: "View engineering case studies",
  },
  {
    title: "CRM and Commercial Workflows",
    body: "CRM process design, lead management workflows, and commercial execution improvements for SMEs.",
    href: "/crm",
    cta: "Explore CRM approach",
  },
  {
    title: "Digitalisation and AI Outcomes",
    body: "Workflow automation and AI-enabled operating models designed for measurable business impact.",
    href: "/services",
    cta: "Explore service portfolio",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Case Studies
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Project Outcomes and Delivery Proof
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Review practical examples of how we solve engineering and digital delivery challenges
            with measurable commercial and operational impact.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {caseStudyGroups.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/[.02]"
              >
                <h2 className="text-lg font-bold text-[#0b1f3a]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
                <span className="mt-4 block text-sm font-semibold text-green-700">{item.cta} &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
