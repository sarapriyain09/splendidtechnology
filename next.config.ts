import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/services/automation-engineering",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/drive-systems-engineering",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/electrical-engineering",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/mechanical-engineering",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/engineering-manufacturing",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/engineering-case-studies",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/engineering-services",
        destination: "/engineering",
        permanent: true,
      },
      {
        source: "/services/erp",
        destination: "/erp",
        permanent: true,
      },
      {
        source: "/services/crm",
        destination: "/crm",
        permanent: true,
      },
      {
        source: "/services/ai",
        destination: "/ai",
        permanent: true,
      },
      {
        source: "/services/case-studies",
        destination: "/case-studies",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
