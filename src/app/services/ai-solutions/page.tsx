import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Automation Solutions for SMEs | Splendid Technology",
  description:
    "AI automation for SMEs including assistants, workflow automations, email and SMS sequences, document processing, and CRM-integrated AI workflows.",
  keywords: [
    "ai automation uk",
    "ai solutions for smes",
    "crm ai workflows",
    "email automation services",
    "sms twilio automation",
    "ai agents for business",
  ],
  alternates: {
    canonical: "/services/ai-solutions",
  },
  openGraph: {
    type: "website",
    title: "AI Automation Solutions for SMEs",
    description:
      "Deploy practical AI workflows that reduce manual work and speed up sales and operations.",
    url: "https://www.splendidtechnology.co.uk/services/ai-solutions",
  },
};

const capabilities = [
  {
    title: "AI Assistants",
    description: "Assistant workflows for sales, support, and internal teams that accelerate repeatable tasks.",
  },
  {
    title: "Workflow Automation",
    description: "Automate multi-step handoffs across CRM, operations, and reporting systems.",
  },
  {
    title: "Email Automation",
    description: "Trigger personalized follow-up sequences from lead, stage, and activity events.",
  },
  {
    title: "SMS and Twilio Integration",
    description: "Build SMS reminders, call workflows, and message logging tied to CRM records.",
  },
  {
    title: "Document Intelligence",
    description: "Extract and structure data from forms, PDFs, and inbound messages.",
  },
  {
    title: "AI Agents",
    description: "Deploy focused agents to monitor, route, and execute routine business actions.",
  },
];

const outcomes = [
  "Faster response times across enquiries and support",
  "Fewer repetitive manual tasks for teams",
  "More reliable follow-up execution",
  "Improved visibility into workflow performance",
  "Scalable growth without linear headcount increases",
];

const rolloutPlan = [
  {
    step: "01",
    title: "Discovery Sprint",
    description: "Identify high-friction workflows and data handoff issues worth automating first.",
  },
  {
    step: "02",
    title: "Pilot Build",
    description: "Ship one AI workflow quickly with measurable baseline and success metrics.",
  },
  {
    step: "03",
    title: "Integration Layer",
    description: "Connect CRM, messaging, email, and reporting systems into one execution flow.",
  },
  {
    step: "04",
    title: "Scale Phase",
    description: "Extend automation to adjacent teams and optimize using operational data.",
  },
];

export default function AISolutionsPage() {
  return (
    <div className="w-full bg-[var(--background)]">
      <section className="border-b border-[#dce8ff] bg-[radial-gradient(circle_at_20%_25%,#dbe9ff_0%,#f5f8ff_50%,#ecfff8_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-flex rounded-full border border-[#b6cbff] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1147bf]">
            AI Automation
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl">
            AI Automation That Improves Daily Execution
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#37486e]">
            Build practical AI workflows for lead response, operations handoffs, and customer communication without replacing your existing systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Book an AI Discovery Call</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">See Demo Workflows</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629]">What We Build</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4d5d80]">
          AI automation services designed for measurable business impact, not experimentation theatre.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <article key={capability.title} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <h3 className="text-base font-bold text-[#132446]">{capability.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce8ff] bg-white/70 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Outcomes</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">What Changes After Automation</h2>
            <ul className="mt-6 space-y-2.5">
              {outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-2 text-sm text-[#334769]">
                  <span className="mt-0.5 text-[#00a87f]">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dce8ff] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Stack Connections</p>
            <h3 className="mt-2 text-xl font-bold text-[#0e1629]">CRM + Messaging + Productivity Tools</h3>
            <p className="mt-3 text-sm leading-6 text-[#4d5d80]">
              Connect Outlook, Google Workspace, Twilio, WhatsApp, and CRM data streams to run one cohesive automation engine.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Outlook", "Google Workspace", "Twilio", "WhatsApp", "HubSpot", "APIs"].map((item) => (
                <span key={item} className="rounded-full border border-[#dce8ff] bg-[#f5f8ff] px-3 py-1 text-xs font-semibold text-[#31476f]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Delivery Model</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">Pilot First, Then Scale</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rolloutPlan.map((phase) => (
            <article key={phase.step} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <p className="text-3xl font-bold text-[#1f6dff]/30">{phase.step}</p>
              <h3 className="mt-2 text-base font-bold text-[#0e1629]">{phase.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{phase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0f2041] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Launch Your First AI Workflow in Weeks</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80">
            Start with one high-impact process, prove value fast, and expand into a connected CRM and automation operating model.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start Your AI Pilot</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
