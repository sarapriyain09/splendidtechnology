import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
    "Splendid Technology Ltd — Industry 4.0 and digital solutions for UK manufacturers. Smart motor monitoring, predictive maintenance, CRM, ERP, and operational transformation — nationwide.",
  keywords: [
    "industrial iot uk",
    "smart motor monitoring uk",
    "predictive maintenance uk",
    "industry 4.0 solutions uk",
    "motor condition monitoring uk",
    "ai process automation uk",
    "industrial iot solutions uk",
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
      "Industry 4.0 and digital solutions for UK manufacturers. Smart motor monitoring, predictive maintenance, CRM, ERP, and operational transformation — nationwide.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | Industrial IoT & Process Automation",
    description:
      "Industry 4.0 and digital solutions for UK manufacturers. Smart motor monitoring, predictive maintenance, CRM, ERP, and operational transformation — nationwide.",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8VJ7HX37V6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8VJ7HX37V6');
          `}
        </Script>
      </head>
      <body className={`${roboto.variable} min-h-screen antialiased`}>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
