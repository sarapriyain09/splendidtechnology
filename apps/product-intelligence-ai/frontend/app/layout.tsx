import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velynxia Product Intelligence AI",
  description: "AI-powered product research for Amazon and B2B opportunities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
