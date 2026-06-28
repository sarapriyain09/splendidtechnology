import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";

export const metadata: Metadata = {
  title: "One Platform for Customer Growth",
  description:
    "Velynxia brings CRM, Sales, CallCRM, Marketing, and AI-powered automation into one Customer Growth Platform. Manage customers, generate leads, and accelerate revenue.",
  keywords: [
    "crm",
    "ai automation",
    "sales automation",
    "customer management",
    "workflow automation",
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
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Velynxia",
    url: "https://www.velynxia.com/",
    logo: "https://www.velynxia.com/images/brand/velynxia-Logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+44 7723 144910",
      email: "info@velynxia.com",
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
      name: "Velynxia",
      url: "https://www.velynxia.com/",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a CRM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A CRM is a customer relationship management system that stores customer data, tracks sales opportunities, and supports follow-up workflows in one place.",
        },
      },
      {
        "@type": "Question",
        name: "Why do SMEs need a CRM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SMEs use CRM to reduce lost leads, improve sales visibility, and create repeatable customer management processes.",
        },
      },
      {
        "@type": "Question",
        name: "Can CRM automate follow-ups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CRM can automate reminders, email sequences, and task assignments to keep follow-up consistent.",
        },
      },
      {
        "@type": "Question",
        name: "Does DemoCRM integrate with Outlook?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DemoCRM can integrate with Outlook and other communication tools as part of a practical workflow setup.",
        },
      },
      {
        "@type": "Question",
        name: "Can AI improve customer management?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. AI can assist with drafting responses, follow-up prompts, and workflow automation to reduce manual tasks and improve customer consistency.",
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageContent />
    </>
  );
}
