import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/caseStudies";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.title} | Case Study`,
    description: study.summary,
    alternates: {
      canonical: `/engineering-case-studies/${study.slug}`,
    },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary,
      url: `https://www.velynxia.com/engineering-case-studies/${study.slug}`,
    },
  };
}

export default async function EngineeringCaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    about: study.category,
    publisher: {
      "@type": "Organization",
      name: "Velynxia",
      url: "https://www.velynxia.com",
    },
    mainEntityOfPage: `https://www.velynxia.com/engineering-case-studies/${study.slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="space-y-4">
        <p className="inline-block rounded-full bg-[#e8eef9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
          {study.category} Case Study
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#0b1f3a] sm:text-4xl">{study.title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-black/70">{study.summary}</p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Challenge</h2>
        <p className="mt-3 text-sm leading-6 text-black/75">{study.challenge}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Baseline Situation</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-black/75">
            {study.baseline.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#0b3d91]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Solution Design</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-black/75">
            {study.solution.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#0b3d91]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Implementation Steps</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-black/75">
            {study.implementation.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#0b3d91]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Results</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-black/75">
            {study.results.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-black/10 bg-[#f7f7f7] p-6">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Delivery Stack</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <span key={item} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/75">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-[#0b1f3a] p-6 text-white">
        <h2 className="text-2xl font-bold">Planning something similar?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          We can scope a phased implementation plan aligned to your commercial and operational priorities.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={study.relatedServiceHref}
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
          >
            {study.relatedServiceLabel}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            Discuss Your Project
          </Link>
          <Link
            href="/engineering-case-studies"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            Back to Case Studies
          </Link>
        </div>
      </section>
    </div>
  );
}
