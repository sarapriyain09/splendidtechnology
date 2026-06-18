import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

const crmAuthorityLinks = [
  {
    title: "CRM Implementation Services",
    href: "/services/sales-crm",
    description: "Explore practical CRM setup and rollout services for UK SMEs.",
  },
  {
    title: "AI Automation Services",
    href: "/services/ai-solutions",
    description: "Automate repetitive sales and customer workflows with AI support.",
  },
  {
    title: "Call CRM Solutions",
    href: "/services/call-crm",
    description: "Connect calls, lead history, and follow-up actions in one system.",
  },
  {
    title: "Book a CRM Demo",
    href: "/demo",
    description: "See how DemoCRM handles sales pipelines and customer management.",
  },
];

export const metadata: Metadata = {
  title: "CRM and AI Automation Insights | Splendid Technology Blog",
  description:
    "Practical guides on CRM implementation, lead management, sales pipeline workflows, and AI automation for UK SMEs.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Splendid Technology CRM and AI Automation Insights",
    url: `${siteUrl}/blog`,
    description:
      "Practical CRM and AI automation guides for UK SMEs focused on lead management and sales workflows.",
    publisher: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: siteUrl,
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.slice(0, 12).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">CRM and AI Automation Insights</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Practical guides on CRM implementation, lead management, sales pipeline workflows,
          and AI automation &mdash; for UK SMEs.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white"
          >
            {post.featuredImage ? (
              <Link href={`/blog/${post.slug}`} className="relative block h-44 w-full">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </Link>
            ) : null}
            <div className="p-6">
              <p className="text-xs text-black/60">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                <Link className="hover:underline" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/70">
                {post.excerpt ?? post.description}
              </p>
              <div className="mt-4">
                <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/blog/${post.slug}`}>
                  Read post
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-black/10 bg-[#f8fbff] p-6">
        <h2 className="text-xl font-semibold tracking-tight text-[#102850]">Core CRM Resources</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
          Looking for practical next steps? Start with these core service pages and map your
          CRM and AI automation roadmap.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {crmAuthorityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-[#dbe7ff] bg-white p-4 transition hover:border-[#9fbefb] hover:bg-[#f5f9ff]"
            >
              <p className="text-sm font-semibold text-[#173567]">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-black/70">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          href="/demo"
        >
          Book a CRM Demo
        </Link>
      </div>
    </div>
  );
}
