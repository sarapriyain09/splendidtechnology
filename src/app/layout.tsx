import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatWidget } from "@/components/ChatWidget";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Splendid Technology",
    template: "%s | Splendid Technology",
  },
  description:
    "UK web development company building custom web apps, e-commerce, automation, and AI integrations — from prototype to production-ready delivery.",
  keywords: [
    "web development company uk",
    "custom web development uk",
    "web app development uk",
    "ecommerce website development uk",
    "ai integration services uk",
    "business automation services uk",
    "web developers leicester",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology",
    description:
      "UK web development company building custom web apps, e-commerce, automation, and AI integrations.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology",
    description:
      "UK web development company building custom web apps, e-commerce, automation, and AI integrations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.variable} min-h-screen antialiased`}>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
