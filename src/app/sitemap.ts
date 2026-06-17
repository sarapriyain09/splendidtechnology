import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllCaseStudies } from "@/lib/caseStudies";
import { getAllLocations } from "@/lib/locations";

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
  const caseStudies = getAllCaseStudies();
  const locations = getAllLocations();

  return [
    { url: `${base}/`, lastModified },
    // Core pages
    { url: `${base}/services`, lastModified },
    { url: `${base}/services/sales-crm`, lastModified },
    { url: `${base}/services/call-crm`, lastModified },
    { url: `${base}/services/ai-solutions`, lastModified },
    { url: `${base}/services/crm-for-manufacturers-uk`, lastModified },
    { url: `${base}/services/crm-for-engineering-companies-uk`, lastModified },
    { url: `${base}/industries/crm-for-engineering-companies`, lastModified },
    { url: `${base}/portfolio`, lastModified },
    { url: `${base}/engineering-case-studies`, lastModified },
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
    ...caseStudies.map((study) => ({
      url: `${base}/engineering-case-studies/${study.slug}`,
      lastModified,
    })),
    ...locations.map((loc) => ({
      url: `${base}/locations/${loc.slug}`,
      lastModified,
    })),
  ];
}
