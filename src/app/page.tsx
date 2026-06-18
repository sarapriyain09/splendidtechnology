import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { HomeHeroVisual } from "@/components/home/HomeHeroVisual";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CRM for Marketing, Sales, and Customer Management | Splendid Technology",
  description:
    "Splendid Technology helps SMEs improve marketing-to-sales conversion with CRM systems for lead management, sales pipelines, and customer management, with optional AI automation add-ons.",
  keywords: [
    "crm for marketing and sales",
    "lead management crm uk",
    "customer management system uk",
    "twilio crm integration",
    "sme crm implementation",
    "ai automation add-on",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "CRM for Marketing, Sales, and Customer Management",
    description:
      "Build a strong CRM foundation for marketing, sales, and customer management, with AI automation as an optional add-on.",
    url: "https://www.splendidtechnology.co.uk/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRM for Marketing, Sales, and Customer Management",
    description:
      "Build a strong CRM foundation for marketing, sales, and customer management, with AI automation as an optional add-on.",
  },
};

const servicePillars = [
  {
    heading: "Primary Focus: CRM",
    points: [
      "Custom CRM Development",
      "Marketing Lead Capture and Qualification",
      "Lead Management",
      "Sales Pipelines",
      "Customer Management",
      "Dashboards",
    ],
  },
  {
    heading: "Additional Service: AI Automation",
    points: [
      "AI Assistants for Follow-Up",
      "Workflow Automation Add-Ons",
      "Email Automation",
      "SMS and Twilio Integration",
      "AI Agents (Optional)",
    ],
  },
  {
    heading: "Business Process Line",
    points: [
      "Marketing to Sales Handoffs",
      "Lead to Opportunity Process",
      "Quote to Order Tracking",
      "Customer Lifecycle Visibility",
    ],
  },
  {
    heading: "Core Integrations",
    points: ["Outlook", "Google Workspace", "WhatsApp", "Twilio", "HubSpot", "APIs"],
  },
];

const problems = [
  "Marketing leads are captured but not followed up consistently",
  "Sales opportunities get lost between enquiry and quote",
  "Customer information is split across multiple tools",
  "Manual updates slow down marketing and sales teams",
];

const solutionTiles = [
  {
    title: "Marketing CRM",
    body: "Capture, qualify, and route leads with clear ownership and faster handoff to sales.",
  },
  {
    title: "Sales CRM",
    body: "Run opportunities through structured stages with follow-up SLAs and conversion visibility.",
  },
  {
    title: "Customer Management",
    body: "Keep customer history, communications, and account status in one connected workspace.",
  },
  {
    title: "AI Automation (Add-On)",
    body: "Add assistant-driven follow-up and workflow automation after CRM foundations are in place.",
  },
  {
    title: "Integrations",
    body: "Connect CRM with Outlook, Google Workspace, WhatsApp, Twilio, HubSpot, and APIs.",
  },
];

const whySplendid = [
  "CRM-first delivery focused on marketing, sales, and customer management",
  "Business process design built around your real team workflows",
  "Strong CRM implementation and adoption expertise",
  "AI automation available as an additional service when needed",
  "Fast implementation with measurable commercial outcomes",
];

const demoItems = [
  "Marketing lead capture workflows",
  "Sales pipeline and follow-up sequences",
  "Customer account and activity views",
  "Twilio and messaging integration options",
  "Dashboard reporting for conversion and pipeline health",
];

const focusTags = ["CRM", "Marketing", "Sales", "Customer Management", "AI Add-On"];

export default function Home() {
  const latestPosts = getAllBlogPosts().slice(0, 2);

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
    name: "Splendid CRM Automation Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Book a demo for implementation and rollout options",
    },
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.splendidtechnology.co.uk/",
    },
  };

  return (
    <div className="relative overflow-hidden bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />

      <section className="relative border-b border-[#dce8ff] bg-[radial-gradient(circle_at_10%_20%,#dbe9ff_0%,#f5f8ff_45%,#effff9_100%)]">
        <div className="absolute left-0 right-0 top-0 h-64 bg-[linear-gradient(120deg,rgba(31,109,255,0.12),rgba(0,184,148,0.06),transparent)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-[#b6cbff] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1147bf]">
              CRM Partner for Marketing, Sales, and Customer Management
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl lg:text-6xl">
              CRM for Marketing, Sales, and Customer Management
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37486e]">
              Build a strong CRM foundation to manage leads, sales pipelines, and customer relationships. Add AI automation as an additional service when your team is ready.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/demo">Book CRM Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Schedule a Call</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {focusTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#cddcff] bg-white/70 px-3 py-1 text-xs font-semibold text-[#38507d]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <HomeHeroVisual />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629]">Positioning</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#4a5a7a]">
          Splendid Technology focuses first on CRM for marketing, sales, and customer management. AI automation is delivered as an additional service where it adds clear value.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {servicePillars.map((pillar) => (
            <article key={pillar.heading} className="rounded-2xl border border-[#d9e5ff] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0e1629]">{pillar.heading}</h3>
              <ul className="mt-4 space-y-2">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#4a5a7a]">
                    <span className="mt-0.5 text-[#00a87f]">●</span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce8ff] bg-white/70 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0e1629]">Problem Signals You Can Fix Fast</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {problems.map((problem) => (
              <div key={problem} className="rounded-2xl border border-[#e3ecff] bg-white p-5">
                <p className="text-base font-semibold text-[#223252]">{problem}?</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629]">CRM-Led Solutions</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionTiles.map((tile) => (
            <article
              key={tile.title}
              className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f4f9ff_60%,#edfff8_100%)] p-6"
            >
              <h3 className="text-lg font-bold text-[#10213f]">{tile.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4d5d80]">{tile.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0f2041] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Why Splendid Technology</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {whySplendid.map((item) => (
              <p key={item} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90">
                ✓ {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-[#0e1629]">Interactive Demo Highlights</h2>
            <p className="mt-3 text-sm leading-6 text-[#4a5a7a]">
              Show your team how a CRM-first system improves marketing, sales, and customer management before rollout.
            </p>
            <ul className="mt-6 space-y-3">
              {demoItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#334769]">
                  <span className="mt-0.5 text-[#1f6dff]">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/demo">View Demo</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://democrm.splendidtechnology.co.uk/" target="_blank" rel="noopener noreferrer">
                  Open Demo CRM
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
              <Image
                src="/images/projects/callcrm.png"
                alt="Call workflow and reporting analytics screenshot"
                width={900}
                height={640}
                className="h-48 w-full object-cover"
              />
              <p className="px-4 py-3 text-sm font-semibold text-[#20345f]">CRM Dashboard</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
              <Image
                src="/images/projects/callcrm.png"
                alt="Pipeline and call workflow screenshot"
                width={900}
                height={640}
                className="h-48 w-full object-cover"
              />
              <p className="px-4 py-3 text-sm font-semibold text-[#20345f]">Pipeline and Call Flows</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white sm:col-span-2">
              <Image
                src="/images/projects/ERP.png"
                alt="Business reporting and workflow analytics screenshot"
                width={1200}
                height={720}
                className="h-52 w-full object-cover"
              />
              <p className="px-4 py-3 text-sm font-semibold text-[#20345f]">Automation and Reporting Analytics</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce8ff] bg-white/70 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629]">Integration Ready from Day One</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4a5a7a]">
            Build on top of your current tools without replacing everything at once.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {["Outlook", "Google Workspace", "WhatsApp", "Twilio", "HubSpot", "Custom APIs"].map((integration) => (
              <div
                key={integration}
                className="rounded-xl border border-[#d7e4ff] bg-white px-3 py-4 text-center text-sm font-semibold text-[#31476f]"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0e1629]">Latest Insights</h2>
            <p className="mt-2 text-sm text-[#4a5a7a]">
              Practical CRM and AI automation playbooks for growing teams.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-[#1147bf] hover:underline">
            View all posts
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {latestPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <p className="text-xs text-[#6d7a97]">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[#0e1629]">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#4a5a7a]">{post.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#dce8ff] bg-[linear-gradient(120deg,#0f2041,#153166)] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Start with CRM. Add AI Automation as You Scale.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80">
            Build a clear business process line across marketing, sales, and customer management first. Then layer AI automation where it drives measurable results.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/contact">Schedule a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
