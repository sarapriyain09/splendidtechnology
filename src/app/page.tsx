import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";

export const metadata: Metadata = {
  title: "CRM for Marketing, Sales, and Customer Management | Splendid Technology",
  description:
    "Simplify operations, automate workflows, and build stronger customer relationships with intelligent CRM and AI solutions for SMEs.",
  keywords: [
    "crm solutions uk",
    "crm for smes",
    "ai automation for smes",
    "sales pipeline crm",
    "customer management software",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "CRM for Marketing, Sales, and Customer Management",
    description:
      "Modern CRM and AI Automation solutions for SMEs with fast implementation and conversion-focused workflows.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRM for Marketing, Sales, and Customer Management",
    description:
      "Modern CRM and AI Automation solutions for SMEs with fast implementation and conversion-focused workflows.",
  },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Splendid Technology Ltd",
    url: "https://www.splendidtechnology.co.uk/",
    logo: "https://www.splendidtechnology.co.uk/images/brand/logo-splendid.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+44 7723 144910",
      email: "info@splendidtechnology.co.uk",
      areaServed: "GB",
      availableLanguage: ["en-GB"],
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DemoCRM",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Book a demo for CRM and AI automation implementation",
    },
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.splendidtechnology.co.uk/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <HomePageContent />
    </>
  );
}
