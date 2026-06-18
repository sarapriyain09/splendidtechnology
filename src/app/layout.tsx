import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
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
    default: "Splendid Technology | CRM and AI Automation for SMEs",
    template: "%s | Splendid Technology",
  },
  description:
    "Splendid Technology helps SMEs grow with CRM implementation, AI automation, workflow systems, and practical business integrations.",
  keywords: [
    "crm for smes uk",
    "crm development uk",
    "ai automation for business",
    "workflow automation uk",
    "lead management crm",
    "client portal development",
    "twilio crm integration",
    "sme automation partner",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Splendid Technology | CRM and AI Automation for SMEs",
    description:
      "CRM, AI automation, client portals, and workflow integrations for growing SMEs.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splendid Technology | CRM and AI Automation for SMEs",
    description:
      "CRM, AI automation, client portals, and workflow integrations for growing SMEs.",
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
  const siteUrl = getSiteUrl();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Splendid Technology Ltd",
    url: siteUrl,
    logo: `${siteUrl}/images/hero/logo.png`,
    email: "info@splendidtechnology.co.uk",
    telephone: "+44 7723 144910",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@splendidtechnology.co.uk",
        telephone: "+44 7723 144910",
        areaServed: "GB",
        availableLanguage: ["en-GB"],
      },
    ],
    sameAs: ["https://www.splendidtechnology.co.uk"],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Splendid Technology Ltd",
    url: siteUrl,
    image: `${siteUrl}/images/hero/logo.png`,
    telephone: "+44 7723 144910",
    email: "info@splendidtechnology.co.uk",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    addressCountry: "GB",
    priceRange: "$$",
    serviceType: [
      "CRM implementation",
      "AI automation solutions",
      "Workflow automation",
      "Client portal development",
      "Business systems integration",
    ],
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
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
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen antialiased`}>
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
