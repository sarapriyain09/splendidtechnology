import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const base = siteUrl.replace(/\/$/, "");
  const lastModified = new Date();
  const posts = getAllBlogPosts();

  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/services`, lastModified },
    { url: `${base}/portfolio`, lastModified },
    { url: `${base}/about`, lastModified },
    { url: `${base}/contact`, lastModified },
    { url: `${base}/blog`, lastModified },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
