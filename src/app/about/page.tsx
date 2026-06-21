import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Velynxia | CRM and AI Automation Partner",
  description:
    "Learn how Velynxia helps SMEs grow with CRM implementation, AI automation, workflow systems, and practical business integrations.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    title: "Clarity Over Complexity",
    description: "We simplify systems so teams can execute faster with less friction and fewer handoffs.",
  },
  {
    title: "Outcomes Over Features",
    description: "Every rollout is tied to measurable metrics such as lead response speed and conversion progress.",
  },
  {
    title: "Build What Teams Will Use",
    description: "We design around real team workflows, not around generic software assumptions.",
  },
  {
    title: "Scale in Phases",
    description: "Start with one high-impact workflow, then expand into a connected operating system.",
  },
];

const capabilities = [
  "CRM solutions and lead management",
  "AI assistants and workflow automation",
  "Email and SMS automation with Twilio",
  "Client portals and internal systems",
  "Reporting dashboards and operational visibility",
  "Integration with Outlook, Google Workspace, WhatsApp, HubSpot, and APIs",
];

const teamHighlights = [
  {
    role: "Founder Leadership",
    detail:
      "Built on decades of engineering and commercial process experience, with a clear focus on practical SME transformation.",
  },
  {
    role: "Technical Delivery",
    detail:
      "Modern web architecture, secure cloud deployments, and reliable implementation across CRM and automation systems.",
  },
  {
    role: "Commercial Execution",
    detail:
      "Pipeline discipline, follow-up workflows, and customer journey design that turns enquiries into opportunities.",
  },
];

export default function AboutPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Velynxia",
    url: "https://www.velynxia.com/",
    description:
      "A CRM and AI Automation partner for SMEs, helping teams improve sales execution, workflows, and operations visibility.",
    areaServed: "United Kingdom",
    knowsAbout: [
      "CRM implementation",
      "AI workflow automation",
      "lead management",
      "client portals",
      "business systems integrations",
    ],
  };

  return (
    <div className="w-full bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <section className="border-b border-[#dce8ff] bg-[radial-gradient(circle_at_20%_20%,#dbe9ff_0%,#f5f8ff_55%,#ecfff8_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-flex rounded-full border border-[#b6cbff] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1147bf]">
            About Velynxia
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl">
            We Help SMEs Grow with CRM and AI Automation Systems
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#37486e]">
            Velynxia is a CRM and AI Automation partner for SMEs. We design and implement connected systems that improve lead flow, follow-up discipline, and operational execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Schedule a Call</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629]">What We Stand For</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <article key={value.title} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <h3 className="text-base font-bold text-[#132446]">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce8ff] bg-white/70 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Capabilities</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">How We Help Teams Execute Better</h2>
            <ul className="mt-6 space-y-2.5">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#334769]">
                  <span className="mt-0.5 text-[#00a87f]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dce8ff] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Positioning</p>
            <h3 className="mt-2 text-xl font-bold text-[#0e1629]">One Clear Identity</h3>
            <p className="mt-3 text-sm leading-6 text-[#4d5d80]">
              We are not a general engineering consultancy. We are a focused CRM and AI Automation partner for SMEs that want repeatable growth systems.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4d5d80]">
              That focus strengthens website clarity, proposal quality, and implementation outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Team Strength
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#0e1629]">Commercial, Technical, and Delivery Capability</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {teamHighlights.map((item) => (
            <article key={item.role} className="rounded-2xl border border-[#dce8ff] bg-white p-6">
              <h3 className="text-base font-bold text-[#132446]">{item.role}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4d5d80]">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0f2041] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Build the Right System, Then Scale It</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80">
            Start with one workflow that moves revenue or operations. Prove value, then expand with confidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Talk to a Specialist</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
