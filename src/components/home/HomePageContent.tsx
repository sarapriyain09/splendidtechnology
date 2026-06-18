"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardFade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const solutionCards = [
  {
    title: "CRM",
    description: "Manage customers and relationships.",
    items: ["Contacts", "Companies", "Activities", "Tasks", "Notes", "Documents"],
  },
  {
    title: "Sales",
    description: "Convert leads into revenue.",
    items: ["Leads", "Opportunities", "Pipelines", "Quotations", "Forecasts", "Follow-ups"],
  },
  {
    title: "CallCRM",
    description: "Engage customers and power outbound sales.",
    items: ["Click-to-call", "Call Campaigns", "Call Logging", "Recordings", "Agent Dashboards", "Follow-up Sequences"],
  },
  {
    title: "Marketing",
    description: "Generate and nurture leads.",
    items: ["LinkedIn Campaigns", "Email Campaigns", "SMS Campaigns", "Segmentation", "Forms", "Landing Pages", "Newsletters"],
  },
  {
    title: "Automation",
    description: "AI-powered workflows and productivity.",
    comingSoon: true,
    items: ["Workflow Builder", "AI Assistant", "Meeting Summaries", "Email Generation", "Follow-up Recommendations"],
  },
  {
    title: "Analytics",
    description: "Measure and improve performance.",
    comingSoon: true,
    items: ["Sales Analytics", "Campaign Analytics", "Call Analytics", "Revenue Forecasting", "Conversion Metrics"],
  },
];

const whySplendid = [
  {
    title: "One Platform",
    description: "One login. One database. One view of your customers.",
  },
  {
    title: "Built for SMEs",
    description: "Simple, affordable and scalable.",
  },
  {
    title: "AI-Ready",
    description: "Automate repetitive work and focus on growth.",
  },
  {
    title: "Outbound Sales Focus",
    description: "CRM, calling and marketing working together.",
  },
];

const customerJourney = [
  { stage: "Lead Generation", app: "Marketing" },
  { stage: "Customer Relationship", app: "CRM" },
  { stage: "Sales Pipeline", app: "Sales" },
  { stage: "Customer Engagement", app: "CallCRM" },
  { stage: "Automation", app: "AI Workflows" },
  { stage: "Insights", app: "Analytics" },
];

const appPreviewByTitle: Record<string, string> = {
  CRM: "/images/projects/CRM%20_updated-dash.png",
  Sales: "/images/projects/sales.png",
  CallCRM: "/images/projects/callcrm-mod.png",
  Marketing: "/images/projects/marketing.png",
};

const sectionAnchors = [
  { label: "Hero", href: "#hero" },
  { label: "Apps", href: "#apps" },
  { label: "Journey", href: "#journey" },
  { label: "Why", href: "#why" },
  { label: "Demo", href: "#ready" },
];

export function HomePageContent() {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-[var(--background)]">
      <section id="hero" className="relative border-b border-[#dce8ff] bg-[radial-gradient(circle_at_5%_5%,#d8e7ff_0%,#f8fbff_56%,#fefaf7_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(31,109,255,0.14),transparent_42%)]" />

        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#46618f]">Splendid Growth Platform</p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl lg:text-6xl">
              One Platform for Customer Growth
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37486e]">
              Manage customers, generate leads, engage prospects and accelerate revenue with integrated CRM, Sales, Calling, Marketing and AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/demo">Book a Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#4a5a7a]">
              <Link href="/services/sales-crm" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                CRM Solutions
              </Link>
              <Link href="/services/ai-solutions" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                AI Automation
              </Link>
              <Link href="/demo" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                DemoCRM
              </Link>
              <Link href="/blog" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                Blog
              </Link>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#d9e6ff] bg-white p-3 shadow-[0_20px_48px_rgba(13,36,84,0.16)]"
          >
            <div className="rounded-2xl border border-[#dce8ff] bg-[#f8fbff]">
              <div className="flex items-center gap-2 border-b border-[#e3edff] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff7d51]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffc54a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#59c88a]" />
                <p className="ml-3 text-xs font-semibold text-[#5e6d8f]">CRM Dashboard</p>
              </div>
              <Image
                src="/images/projects/CRM%20_updated-dash.png"
                alt="CRM dashboard screenshot showing sidebar, activities, and task panels"
                width={1280}
                height={780}
                loading="lazy"
                className="h-auto w-full rounded-b-2xl object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="sticky top-0 z-40 border-b border-[#dce8ff] bg-white/85 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm font-semibold text-[#304c7f] sm:px-6 lg:px-8">
          {sectionAnchors.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 whitespace-nowrap transition hover:bg-[#f3f8ff]">
              {item.label}
            </a>
          ))}
        </nav>
      </div>


      <motion.section id="apps" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-16 sm:py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Platform Apps</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4a5a7a]">All core growth functions are connected to one customer record, giving your team full visibility from first touch to repeat business.</p>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {solutionCards.map((card) => (
              <motion.article key={card.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f4f9ff_100%)] p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#122443]">{card.title}</h3>
                  {card.comingSoon ? <span className="rounded-full border border-[#ffd6a8] bg-[#fff3e5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9b5a00]">Coming Soon</span> : null}
                </div>
                <p className="mt-2 text-sm text-[#425375]">{card.description}</p>
                {appPreviewByTitle[card.title] ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[#dce8ff] bg-white">
                    <Image
                      src={appPreviewByTitle[card.title]}
                      alt={`${card.title} preview`}
                      width={840}
                      height={420}
                      loading="lazy"
                      className="h-28 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-dashed border-[#d6e2fb] bg-[linear-gradient(180deg,#fbfdff_0%,#f3f7ff_100%)] text-xs font-semibold uppercase tracking-[0.12em] text-[#6d81a9]">
                    Preview Coming Soon
                  </div>
                )}
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#425375]">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#5a82d6]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="journey" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Customer Journey</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4a5a7a]">Each stage feeds the next, so your team can move from lead capture to revenue with fewer handoff gaps.</p>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customerJourney.map((item, index) => (
            <motion.article key={item.stage} variants={cardFade} whileHover={{ y: -4 }} className="rounded-xl border border-[#dce8ff] bg-white px-5 py-5 shadow-sm transition duration-300 hover:shadow-md">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[#d8e5ff] bg-[#f3f8ff] px-2 text-xs font-semibold text-[#355ea8]">{index + 1}</span>
              <p className="text-sm font-semibold text-[#4b5e83]">{item.stage}</p>
              <p className="my-2 text-lg text-[#9cb0d4]">↓</p>
              <p className="text-base font-bold text-[#20345f]">{item.app}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section id="why" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Splendid Growth Platform?</h2>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whySplendid.map((item) => (
            <motion.article key={item.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f6fbff_100%)] p-5">
              <h3 className="text-lg font-bold text-[#182c54]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#485a7e]">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section id="ready" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#6a96ff] bg-[linear-gradient(120deg,#1a4fcd,#2769ec,#2f7af7)] px-6 py-12 text-white shadow-[0_18px_45px_rgba(30,82,201,0.35)] sm:px-10">
          <motion.div
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.1, 1] }}
            transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl"
          />
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Grow?</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Book a demo and discover how Splendid Growth Platform helps SMEs attract, manage and convert customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/45 bg-transparent text-white hover:bg-white/12">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="fixed bottom-5 right-5 z-50">
        <div className="flex flex-col items-end gap-2">
          {fabOpen ? (
            <>
              <Link href="/demo" className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3158] shadow-sm hover:bg-[#f5f9ff]">
                Book Demo
              </Link>
              <a href="https://wa.me/447723144910" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3158] shadow-sm hover:bg-[#f5f9ff]">
                WhatsApp
              </a>
              <a href="mailto:info@splendidtechnology.co.uk" className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3158] shadow-sm hover:bg-[#f5f9ff]">
                Email
              </a>
              <Link href="/contact" className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3158] shadow-sm hover:bg-[#f5f9ff]">
                Calendar
              </Link>
            </>
          ) : null}
          <button onClick={() => setFabOpen((v) => !v)} className="rounded-full bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1147bf]">
            {fabOpen ? "Close" : "Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
