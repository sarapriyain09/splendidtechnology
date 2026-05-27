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

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Splendid Technology | Industrial IoT & Process Automation",
    template: "%s | Splendid Technology",
  },
  description:
    "Splendid Technology Ltd — Industrial IoT, smart motor monitoring, predictive maintenance, and AI-powered process automation for UK manufacturers and industrial SMEs. Based in Leicester.",
  keywords: [
    "industrial iot uk",
    "smart motor monitoring uk",
    "predictive maintenance uk",
    "industry 4.0 solutions uk",
    "motor condition monitoring leicester",
    "ai process automation uk",
    "industrial iot leicester",
    "motor diagnostic kit uk",
    "smart factory solutions uk",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology | Industrial IoT & Process Automation",
    description:
      "Smart motor monitoring, predictive maintenance, and AI-powered process automation for UK manufacturers. Based in Leicester.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | Industrial IoT & Process Automation",
    description:
      "Smart motor monitoring, predictive maintenance, and AI-powered process automation for UK manufacturers. Based in Leicester.",
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
