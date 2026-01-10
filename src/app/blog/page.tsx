import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on UK web development costs, web apps vs websites, ecommerce, automation, and AI integrations.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Practical guides on web development, ecommerce, automation, and AI—UK
          focused.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-black/10 bg-white p-6"
          >
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
              {post.description}
            </p>
            <div className="mt-4">
              <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/blog/${post.slug}`}>
                Read post
              </Link>
            </div>
          </article>
        ))}
      </section>

      <div>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          href="/contact"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
