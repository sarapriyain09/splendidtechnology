import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CRM Solutions for Sales Automation and Customer Management",
  description:
    "CRM solutions for growing businesses focused on sales automation, customer management, and workflow automation.",
  keywords: [
    "crm",
    "sales automation",
    "customer management",
    "workflow automation",
    "crm solutions uk",
    "crm implementation",
  ],
  alternates: {
    canonical: "/services/sales-crm",
  },
  openGraph: {
    type: "website",
    title: "CRM Solutions for Sales Automation and Customer Management",
    description:
      "Build CRM systems for sales automation, customer management, and workflow execution.",
    url: "https://www.velynxia.com/services/sales-crm",
  },
};

const crmModules = [
  {
    title: "Lead and Contact Hub",
    body: "Capture leads from forms, inboxes, and imports with full customer history in one view.",
  },
  {
    title: "Pipeline Management",
    body: "Track opportunities through custom stages with SLA reminders and deal probability scoring.",
  },
  {
    title: "Automated Follow-Up",
    body: "Trigger email and SMS nudges automatically so your team never misses the right moment.",
  },
  {
    title: "Dashboards and Forecasting",
    body: "Monitor conversion rates, lead velocity, forecast value, and team performance in real time.",
  },
  {
    title: "Role-Based Portals",
    body: "Create sales, manager, and customer portal views that keep work focused and secure.",
  },
  {
    title: "Integrations",
    body: "Connect Outlook, Google Workspace, Twilio, WhatsApp, and custom APIs.",
  },
];

const commercialOutcomes = [
  "Faster lead response and cleaner handoffs",
  "Higher follow-up consistency across reps",
  "Better quote-to-win visibility",
  "Less manual admin and duplicate entry",
  "Stronger forecasting confidence",
];

const implementationPhases = [
  {
    step: "01",
    title: "Workflow Mapping",
    description: "Map your current lead-to-close process and identify bottlenecks.",
  },
  {
    step: "02",
    title: "CRM Blueprint",
    description: "Define stages, fields, automations, dashboards, and permissions.",
  },
  {
    step: "03",
    title: "Build and Integrate",
    description: "Ship the CRM with integrations and migrate live sales data safely.",
  },
  {
    step: "04",
    title: "Adopt and Scale",
    description: "Train teams, improve usage discipline, and expand automation in waves.",
  },
];

const pricingBands = [
  {
    title: "Starter",
    price: "from GBP 9 per month",
    points: ["Single team workflow", "Lead and pipeline core", "Basic dashboards"],
  },
  {
    title: "Growth",
    price: "from GBP 19 per month",
    points: ["Automation sequences", "Opportunity tracking", "Advanced reporting"],
    featured: true,
  },
  {
    title: "Scale",
    price: "from GBP 49 per month",
    points: ["Multi-team access", "Custom fields and flows", "Priority support"],
  },
];

export default function SalesCRMPage() {
  return (
    <div className="w-full bg-[var(--background)]">
      <section className="border-b border-[#dce8ff] bg-[radial-gradient(circle_at_15%_25%,#dbe9ff_0%,#f5f8ff_50%,#eefcf7_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-[#b6cbff] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1147bf]">
              CRM Solutions
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl">
              A Sales CRM Built Around Your Real Sales Process
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#37486e]">
              Replace fragmented spreadsheets and rigid tools with a CRM platform designed for your team, your stages, and your growth goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/demo">Book a CRM Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Schedule a Call</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 pt-1">
              <Link className="text-sm font-medium text-blue-700 hover:underline" href="/">
                Homepage
              </Link>
              <Link className="text-sm font-medium text-blue-700 hover:underline" href="/demo">
                DemoCRM
              </Link>
              <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services/ai-solutions">
                AI Automation
              </Link>
              <Link className="text-sm font-medium text-blue-700 hover:underline" href="/blog">
                Blog
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#dce8ff] bg-white shadow-[0_26px_70px_rgba(17,71,191,0.16)]">
            <Image
              src="/images/projects/CRM.png"
              alt="CRM dashboard showing leads, pipeline, and sales analytics"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629]">Core CRM Modules</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4d5d80]">
          A practical feature set that supports daily execution, not just reporting.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crmModules.map((module) => (
            <article key={module.title} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <h3 className="text-base font-bold text-[#132446]">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{module.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce8ff] bg-white/70 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Business Outcomes</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">What Improves After CRM Rollout</h2>
            <ul className="mt-6 space-y-2.5">
              {commercialOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-2 text-sm text-[#334769]">
                  <span className="mt-0.5 text-[#00a87f]">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dce8ff] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Integrations</p>
            <h3 className="mt-2 text-xl font-bold text-[#0e1629]">Connect the Stack You Already Use</h3>
            <p className="mt-3 text-sm leading-6 text-[#4d5d80]">
              We integrate CRM with Outlook, Google Workspace, Twilio, WhatsApp, forms, and your internal systems so your team can automate without disruption.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Outlook", "Microsoft 365", "Twilio", "WhatsApp", "OpenAI", "Google Workspace"].map((item) => (
                <span key={item} className="rounded-full border border-[#dce8ff] bg-[#f5f8ff] px-3 py-1 text-xs font-semibold text-[#31476f]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Implementation</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">How We Deliver</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {implementationPhases.map((phase) => (
            <article key={phase.step} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <p className="text-3xl font-bold text-[#1f6dff]/30">{phase.step}</p>
              <h3 className="mt-2 text-base font-bold text-[#0e1629]">{phase.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{phase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0f2041] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#71a0ff]">Pricing Bands</p>
              <h2 className="mt-2 text-3xl font-bold">Transparent Entry Points</h2>
            </div>
            <p className="max-w-md text-sm text-white/70">Final pricing depends on modules, integrations, and rollout scope.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pricingBands.map((plan) => (
              <article
                key={plan.title}
                className={`rounded-2xl border p-6 ${plan.featured ? "border-[#3f77ff] bg-white/10" : "border-white/20 bg-white/5"}`}
              >
                <h3 className="text-base font-bold">{plan.title}</h3>
                <p className="mt-2 text-sm font-semibold text-[#9fd2ff]">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-[#73d6bf]">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/services/sales-crm/demo">Request Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/contact">Get Proposal</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
