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
  },
  twitter: {
    card: "summary_large_image",
    title: "Velynxia | One Platform for Customer Growth",
    description:
      "Integrated CRM, Sales, CallCRM, Marketing, and AI automation for growing SMEs. Grow Faster. Sell Smarter.",
  },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Splendid Technology Ltd",
    url: "https://www.splendidtechnology.co.uk/",
    logo: "https://www.splendidtechnology.co.uk/images/brand/velynxia-Logo.png",
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
