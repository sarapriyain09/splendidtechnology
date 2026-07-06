import type { NextConfig } from "next";

const DEFAULT_REMOTE_IMAGE_HOSTS = [
  "images.unsplash.com",
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
  "i.etsystatic.com",
  "img.etsystatic.com",
  "img.alicdn.com",
  "ae01.alicdn.com",
  "sc04.alicdn.com",
  "cdn.shopify.com",
];

function parseImageHostsFromEnv(rawValue: string | undefined): string[] {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

const remoteImageHosts = Array.from(
  new Set([
    ...DEFAULT_REMOTE_IMAGE_HOSTS,
    ...parseImageHostsFromEnv(process.env.NEXT_IMAGE_REMOTE_HOSTS),
  ]),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...remoteImageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
