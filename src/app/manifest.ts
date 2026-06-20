import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Velynxia | One Platform for Customer Growth",
    short_name: "Velynxia",
    description:
      "Velynxia is a Customer Growth Platform with integrated CRM, Sales, CallCRM, Marketing, and AI-powered automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/brand/velynxia-Logo.png",
        sizes: "620x248",
        type: "image/png",
      },
    ],
  };
}
