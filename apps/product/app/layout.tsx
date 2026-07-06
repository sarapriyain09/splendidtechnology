import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velynxia Product Platform",
  description: "AI-first product platform from idea to design, production, sales, and continuous improvement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
