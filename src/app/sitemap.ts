import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllLocations } from "@/lib/locations";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const base = siteUrl.replace(/\/$/, "");
  const lastModified = new Date();
  const posts = getAllBlogPosts();
  const locations = getAllLocations();

  return [
    { url: `${base}/`, lastModified },
    // Core pages
    { url: `${base}/services`, lastModified },
    { url: `${base}/services/sales-crm`, lastModified },
    { url: `${base}/services/call-crm`, lastModified },
    { url: `${base}/services/ai-solutions`, lastModified },
    { url: `${base}/portfolio`, lastModified },
    { url: `${base}/about`, lastModified },
    { url: `${base}/about/rajagopalan-saravanan`, lastModified },
    { url: `${base}/pricing`, lastModified },
    { url: `${base}/contact`, lastModified },
    { url: `${base}/blog`, lastModified },
    { url: `${base}/locations`, lastModified },
    // SEO landing pages
    { url: `${base}/crm-for-engineering-companies`, lastModified },
    { url: `${base}/lead-management-software`, lastModified },
    { url: `${base}/sales-pipeline-management`, lastModified },
    { url: `${base}/call-management-crm`, lastModified },
    { url: `${base}/ai-business-automation`, lastModified },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    ...locations.map((loc) => ({
      url: `${base}/locations/${loc.slug}`,
      lastModified,
    })),
  ];
}
