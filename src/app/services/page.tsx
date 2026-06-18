import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM and AI Automation Services for SMEs | Splendid Technology",
  description:
    "Explore Splendid Technology services for CRM systems, AI automation, client portals, workflow solutions, and business integrations for growing SMEs.",
  keywords: [
    "crm services uk",
    "ai automation services uk",
    "workflow automation for smes",
    "client portal development uk",
    "twilio crm integration",
    "business systems integration uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const serviceLines = [
  {
    icon: "📈",
    label: "CRM",
    title: "CRM Solutions",
    description:
      "Design and implement CRM systems that improve lead management, pipeline visibility, and customer follow-up discipline.",
    bullets: [
      "Custom CRM development",
      "Lead management workflows",
      "Sales pipeline setup",
      "Customer portals",
      "Dashboard reporting",
    ],
    href: "/services/sales-crm",
  },
  {
    icon: "🧠",
    label: "AI",
    title: "AI Automation",
    description:
      "Deploy practical AI workflows that remove repetitive work and accelerate sales and operations response time.",
    bullets: [
      "AI assistants",
      "Workflow automation",
      "Email automation",
      "SMS and Twilio integration",
      "AI agents",
    ],
    href: "/services/ai-solutions",
  },
  {
    icon: "🧩",
    label: "Operations",
    title: "Business Operations Systems",
    description:
      "Build internal systems that unify delivery, documentation, and visibility across customer-facing teams.",
    bullets: [
      "Client portals",
      "Document management",
      "Internal systems",
      "Operational reporting",
      "Role-based access workflows",
    ],
    href: "/services/web-app-development",
  },
  {
    icon: "🔌",
    label: "Integrations",
    title: "Business Integrations",
    description:
      "Connect your CRM and automation platform with messaging, productivity, and communication tools.",
    bullets: [
      "Outlook integration",
      "Google Workspace integration",
      "WhatsApp automation",
      "Twilio voice and SMS",
      "HubSpot and custom APIs",
    ],
    href: "/contact",
  },
];

const integrationStack = [
  "Outlook",
  "Google Workspace",
  "WhatsApp",
  "Twilio",
  "HubSpot",
  "REST APIs",
  "Webhooks",
  "Stripe",
];

const deliveryModel = [
  {
    step: "01",
    title: "Discovery",
    description: "Map current sales and operations workflows and identify high-friction bottlenecks.",
  },
  {
    step: "02",
    title: "Blueprint",
    description: "Design your CRM, AI automation, and integration architecture with clear rollout priorities.",
  },
  {
    step: "03",
    title: "Implementation",
    description: "Build and deploy high-impact workflows, dashboards, and portal modules in phases.",
  },
  {
    step: "04",
    title: "Optimization",
    description: "Train teams, refine automations, and scale systems using real performance data.",
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            CRM and AI Automation Services for Growing SMEs
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We help businesses grow through CRM, AI automation, workflow systems, and integrations
            that connect sales, operations, and customer delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Demo
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Core Service Areas</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Four connected service pillars designed to create one operating system for growth.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {serviceLines.map((line) => (
              <article key={line.title} className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{line.icon}</span>
                  <span className="rounded-full bg-[#0b1f3a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/70">
                    {line.label}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#0b1f3a]">{line.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">{line.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {line.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 text-green-600">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={line.href} className="mt-6 inline-flex text-sm font-semibold text-[#0b3d91] hover:underline">
                  Explore {line.title} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Integration Ecosystem</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            We integrate with your existing tools so your team can automate without disruptive re-platforming.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {integrationStack.map((tool) => (
              <div
                key={tool}
                className="rounded-xl border border-black/10 bg-white px-4 py-4 text-center text-sm font-semibold text-[#0b1f3a]"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">Delivery Model</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">How We Implement Systems That Stick</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryModel.map((phase) => (
              <article key={phase.step} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-green-600/30">{phase.step}</p>
                <h3 className="mt-2 text-base font-bold text-[#0b1f3a]">{phase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{phase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Positioning</p>
          <blockquote className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-8 text-white">
            We are a CRM and AI Automation partner for SMEs. We build connected systems that improve lead flow,
            team execution, and operational visibility.
          </blockquote>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14 text-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Start with One High-Impact Workflow</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
            We help you choose the right first implementation so your team sees measurable value quickly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b1f3a] px-8 py-3 font-bold text-white hover:bg-[#0b3d91]"
            >
              Book Demo
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-[#0b1f3a]/30 px-8 py-3 font-bold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
