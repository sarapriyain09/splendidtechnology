import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velynxia Product Studio",
  description: "AI-powered product lifecycle workspace for product discovery and development",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
