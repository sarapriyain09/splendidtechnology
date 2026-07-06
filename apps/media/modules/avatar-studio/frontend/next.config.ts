import type { NextConfig } from "next";

function validateProductionEnv(): void {
  const appEnv = (process.env.APP_ENV || "development").trim().toLowerCase();
  if (appEnv !== "production") {
    return;
  }

  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required when APP_ENV=production");
  }

  if (apiBaseUrl.includes("localhost") || apiBaseUrl.includes("127.0.0.1")) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL cannot point to localhost when APP_ENV=production");
  }
}

validateProductionEnv();

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
