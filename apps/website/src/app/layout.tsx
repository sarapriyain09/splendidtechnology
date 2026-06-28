import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { getSiteUrl } from "@/lib/site-url";

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Velynxia | One Platform for Customer Growth",
    template: "%s | Velynxia",
  },
  description:
    "Velynxia is a Customer Growth Platform with integrated CRM, Sales, CallCRM, Marketing, and AI-powered automation to help SMEs grow faster and sell smarter.",
  keywords: [
    "crm for smes uk",
    "crm implementation uk",
    "ai automation for smes",
    "sales automation uk",
    "customer management software uk",
    "workflow automation uk",
    "twilio crm integration",
    "outlook crm integration",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Velynxia | One Platform for Customer Growth",
    description:
      "Integrated CRM, Sales, CallCRM, Marketing, and AI automation for growing SMEs. Grow Faster. Sell Smarter.",
    url: "/",
    siteName: "Velynxia",
    images: [
      {
        url: "/images/brand/velynxia-og.png",
        width: 1200,
        height: 630,
        alt: "Velynxia | One Platform for Customer Growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velynxia | One Platform for Customer Growth",
    description:
      "Integrated CRM, Sales, CallCRM, Marketing, and AI automation for growing SMEs. Grow Faster. Sell Smarter.",
    images: ["/images/brand/velynxia-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("cookie_consent")?.value;
  const initialConsentChoice =
    consentCookie === "accepted" || consentCookie === "rejected"
      ? consentCookie
      : null;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Velynxia",
    url: siteUrl,
    logo: `${siteUrl}/images/brand/velynxia-Logo.png`,
    email: "info@velynxia.com",
    telephone: "+44 7723 144910",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@velynxia.com",
        telephone: "+44 7723 144910",
        areaServed: "GB",
        availableLanguage: ["en-GB"],
      },
    ],
    sameAs: ["https://www.velynxia.com"],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Velynxia",
    url: siteUrl,
    image: `${siteUrl}/images/brand/velynxia-Logo.png`,
    telephone: "+44 7723 144910",
    email: "info@velynxia.com",
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
      "Sales automation",
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
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var KEY = 'cookie_consent';

                function parseCookieChoice() {
                  var cookie = document.cookie
                    .split(';')
                    .map(function (part) { return part.trim(); })
                    .find(function (part) { return part.indexOf(KEY + '=') === 0; });

                  if (!cookie) return null;
                  var value = cookie.split('=')[1];
                  return value === 'accepted' || value === 'rejected' ? value : null;
                }

                function getChoice() {
                  try {
                    var localValue = window.localStorage.getItem(KEY);
                    if (localValue === 'accepted' || localValue === 'rejected') {
                      return localValue;
                    }
                  } catch (e) {
                    // Ignore localStorage failures.
                  }

                  return parseCookieChoice();
                }

                function updateConsent(choice) {
                  if (typeof window.gtag !== 'function') return;

                  var granted = {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                  };

                  var denied = {
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                  };

                  window.gtag('consent', 'update', choice === 'accepted' ? granted : denied);
                }

                function hideBanner() {
                  var banner = document.getElementById('cookie-consent-banner');
                  if (banner) {
                    banner.style.display = 'none';
                  }
                }

                function persistChoice(choice) {
                  try {
                    window.localStorage.setItem(KEY, choice);
                  } catch (e) {
                    // Ignore localStorage failures.
                  }

                  document.cookie = KEY + '=' + choice + '; Max-Age=31536000; Path=/; SameSite=Lax';
                  updateConsent(choice);
                  hideBanner();
                }

                function applyExistingChoice() {
                  var choice = getChoice();
                  if (!choice) return;
                  updateConsent(choice);
                  hideBanner();
                }

                document.addEventListener('click', function (event) {
                  var target = event.target;
                  if (!(target instanceof Element)) return;

                  var choiceButton = target.closest('[data-cookie-choice]');
                  if (!choiceButton) return;

                  var choice = choiceButton.getAttribute('data-cookie-choice');
                  if (choice === 'accepted' || choice === 'rejected') {
                    persistChoice(choice);
                  }
                });

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', applyExistingChoice);
                } else {
                  applyExistingChoice();
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen antialiased`}>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
        <GoogleAnalytics gaId="G-8VJ7HX37V6" />
        <ChatWidget />
        <WhatsAppButton />
        <CookieConsentBanner initialConsentChoice={initialConsentChoice} />
      </body>
    </html>
  );
}
