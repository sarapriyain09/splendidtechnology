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
        destination: "/portfolio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
