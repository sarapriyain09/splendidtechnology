import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostHtml } from "@/lib/blog";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getBlogPostHtml(slug);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      images: meta.featuredImage ? [{ url: meta.featuredImage }] : undefined,
    },
    twitter: {
      card: meta.featuredImage ? "summary_large_image" : "summary",
      title: meta.title,
      description: meta.description,
      images: meta.featuredImage ? [meta.featuredImage] : undefined,
    },
    alternates: {
      canonical: `/blog/${meta.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, html } = await getBlogPostHtml(slug);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs text-black/60">
          {new Date(meta.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="text-sm leading-6 text-black/70">{meta.description}</p>
        {meta.excerpt ? (
          <div className="rounded-xl border border-black/10 bg-[#f7f7f7] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black/50">In Short</p>
            <p className="mt-1 text-sm leading-6 text-black/75">{meta.excerpt}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/sales-crm">
            CRM Services
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/ai-solutions">
            AI Solutions
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/iot-solutions">
            IoT Solutions
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/contact">
            Contact
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/blog">
            All posts
          </Link>
        </div>
      </header>

      {meta.featuredImage ? (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-black/10 sm:h-80">
          <Image
            src={meta.featuredImage}
            alt={meta.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <article
        className="prose prose-slate max-w-none"
        // Content is authored by us from Markdown files in-repo.
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">Want a clear quote?</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Share your goals, timeline, and any examples you like. We&apos;ll respond
          with a realistic scope, timeline, and estimate.
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            href="/contact"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
