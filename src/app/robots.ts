import type { MetadataRoute } from "next";

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/industrial-iot/",
          "/engineering-case-studies/",
          "/tools/mtbf/",
          "/crm-for-engineering-companies/",
          "/lead-management-software/",
          "/sales-pipeline-management/",
          "/industries/industrial-iot-for-manufacturers/",
          "/industries/digital-transformation-for-manufacturers/",
        ],
      },
    ],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
