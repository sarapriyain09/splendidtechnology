import Link from "next/link";
import type { Metadata } from "next";
import { getAllCaseStudies } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "Implementation Case Studies",
  description:
    "Detailed case studies across CRM implementation, AI automation, workflow integrations, and business operations systems for UK SMEs.",
  alternates: {
    canonical: "/engineering-case-studies",
  },
};

export default function EngineeringCaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="bg-white">
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Implementation Stories
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            CRM and AI Automation Case Studies
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Detailed implementation stories covering CRM rollout,
            AI workflow automation, integration delivery, and process redesign.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-6 sm:p-8">
                  <span className="inline-block rounded-full bg-[#e8eef9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                    {study.category}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a]">
                    {study.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{study.summary}</p>

                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">Challenge</p>
                      <p>{study.challenge}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Baseline</p>
                      <ul className="mt-1 space-y-1">
                        {study.baseline.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Solution</p>
                      <ul className="mt-1 space-y-1">
                        {study.solution.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Results</p>
                      <ul className="mt-1 space-y-1">
                        {study.results.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#16a34a]">&#10003;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {study.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/engineering-case-studies/${study.slug}`}
                      className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b3d91]"
                    >
                      Read full case study
                    </Link>
                  </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#d8e2f3] bg-[#f7faff] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#0b1f3a]">What These Case Studies Cover</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">CRM and Commercial Workflows</p>
              <p className="mt-1 text-sm text-slate-700">
                Lead capture, pipeline stages, quote follow-up, and commercial reporting improvements.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Industrial IoT and Reliability</p>
              <p className="mt-1 text-sm text-slate-700">
                Operational monitoring, alerting workflows, and reliability improvement deployment.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Workflow Design and Integrations</p>
              <p className="mt-1 text-sm text-slate-700">
                Quote-to-order process redesign and supplier qualification system implementation.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">AI-Assisted Operations</p>
              <p className="mt-1 text-sm text-slate-700">
                AI triage workflows with human approval guardrails for industrial teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Need analysis support for a project?</h2>
          <p className="mt-3 text-slate-300">
            We provide practical, decision-ready implementation support for
            CRM, automation, and business workflow systems.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Discuss a Project
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Solution Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
