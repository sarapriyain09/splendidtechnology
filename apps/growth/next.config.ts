import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  async rewrites() {
    const aimediaOrigin =
      process.env.AIMEDIA_ORIGIN ?? "https://aimedia.velynxia.com";

    return [
      {
        source: "/aimedia/:path*",
        destination: `${aimediaOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
