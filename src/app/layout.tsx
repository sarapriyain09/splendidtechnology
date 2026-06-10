import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

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
    default: "Splendid Technology | CRM, Digitalisation, Web Apps & AI Solutions",
    template: "%s | Splendid Technology",
  },
  description:
    "Splendid Technology Ltd provides CRM implementation, digitalisation services, workflow automation, SaaS and web app development, and AI solutions for UK SMEs.",
  keywords: [
    "crm for smes uk",
    "digitalisation services uk",
    "workflow automation uk",
    "saas development uk",
    "custom web app development uk",
    "ai process automation uk",
    "business systems integration uk",
    "digital transformation for small business uk",
    "leicester crm development",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology | CRM, Digitalisation, Web Apps & AI Solutions",
    description:
      "CRM, workflow automation, SaaS and web app development, and AI-enabled digital solutions for UK SMEs.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | CRM, Digitalisation, Web Apps & AI Solutions",
    description:
      "CRM, workflow automation, SaaS and web app development, and AI-enabled digital solutions for UK SMEs.",
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8VJ7HX37V6"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
              gtag('config', 'G-8VJ7HX37V6');
            `,
          }}
        />
      </head>
      <body className={`${roboto.variable} min-h-screen antialiased`}>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
        <ChatWidget />
        <WhatsAppButton />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
