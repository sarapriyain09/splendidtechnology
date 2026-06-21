import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/industrial-iot/",
          "/proof-of-concept/",
          "/products/",
          "/industries/",
          "/engineering-case-studies/",
          "/tools/mtbf/",
          "/crm-for-engineering-companies/",
          "/services/iot-solutions/",
          "/services/industrial-iot-for-manufacturers-uk/",
          "/services/predictive-maintenance-solutions-uk/",
          "/services/reliability-engineering/",
          "/services/reliability-engineering-services/",
          "/services/digital-transformation-for-manufacturers-uk/",
          "/services/crm-for-manufacturers-uk/",
          "/services/crm-for-engineering-companies-uk/",
          "/industries/industrial-iot-for-manufacturers/",
          "/industries/digital-transformation-for-manufacturers/",
        ],
      },
    ],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
