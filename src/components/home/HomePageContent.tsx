"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { aiMediaStudios } from "@/lib/ai-media";

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
    href: "/crm",
    description: "Manage customers and relationships.",
    items: ["Contacts", "Companies", "Activities", "Tasks", "Notes", "Documents"],
  },
  {
    title: "Sales",
    href: "/sales",
    description: "Convert leads into revenue.",
    items: ["Leads", "Opportunities", "Pipelines", "Quotations", "Forecasts", "Follow-ups"],
  },
  {
    title: "CallCRM",
    href: "/callcrm",
    description: "Engage customers and power outbound sales.",
    items: ["Click-to-call", "Call Campaigns", "Call Logging", "Recordings", "Agent Dashboards", "Follow-up Sequences"],
  },
  {
    title: "Marketing",
    href: "/marketing",
    description: "Generate and nurture leads.",
    items: ["LinkedIn Campaigns", "Email Campaigns", "SMS Campaigns", "Segmentation", "Forms", "Landing Pages", "Newsletters"],
  },
  {
    title: "Automation",
    href: "/automation",
    description: "AI-powered workflows and productivity.",
    items: ["Workflow Builder", "AI Assistant", "Meeting Summaries", "Email Generation", "Follow-up Recommendations"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    description: "Measure and improve performance.",
    items: ["Sales Analytics", "Campaign Analytics", "Call Analytics", "Revenue Forecasting", "Conversion Metrics"],
  },
];

const whyVelynxia = [
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
  CRM: "/images/projects/Vel-CRM.png",
  Sales: "/images/projects/Vel-Sales.png",
  CallCRM: "/images/projects/Vel-CallCRM.png",
  Marketing: "/images/projects/Vel-Marketing.png",
  Automation: "/images/projects/Vel-Automation.png",
  Analytics: "/images/projects/Vel-Analytics.png",
};

const sectionAnchors = [
  { label: "Hero", href: "#hero" },
  { label: "Need of CRM", href: "#need-of-crm" },
  { label: "Products", href: "#products" },
  { label: "AI Media", href: "#ai-media-suite" },
  { label: "Journey", href: "#journey" },
  { label: "Why", href: "#why" },
  { label: "Demo", href: "#ready" },
];

const crmVideoUrl = "https://www.youtube.com/watch?v=IjFkPyT6mns";
const crmVideoEmbed = "https://www.youtube-nocookie.com/embed/IjFkPyT6mns?rel=0&modestbranding=1&playsinline=1";

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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#46618f]">Velynxia Growth Platform &middot; Grow Faster. Sell Smarter.</p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl lg:text-6xl">
              Two Pillars, One Platform for Customer Growth and AI Media Creation
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37486e]">
              Run your Growth Platform and AI Media Suite from one place. Manage customers, generate leads, and produce scripts, voiceovers, videos, podcasts, and AI avatar content faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/demo">Book Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#products">Explore Platform</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/ai-media">Explore AI Media</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#4a5a7a]">
              <Link href="/services/sales-crm" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                CRM Solutions
              </Link>
              <Link href="/services/ai-solutions" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                AI Automation
              </Link>
              <Link href="#products" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1.5 hover:bg-[#f3f8ff]">
                Products
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
                src="/images/projects/Vel-CRM.png"
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

      <motion.section id="need-of-crm" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-[#dce8ff] bg-white p-3 shadow-[0_16px_42px_rgba(16,39,88,0.14)]">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#dce8ff] bg-[#f8fbff]">
              <iframe
                src={crmVideoEmbed}
                title="Need of CRM for growing businesses"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Need of CRM</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Growing Businesses Need a CRM</h2>
            <p className="mt-4 text-base leading-7 text-[#44567a]">
              A CRM helps you stop lead leakage, structure follow-ups, and give every team one shared view of customers and opportunities.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-[#2b426d] sm:grid-cols-2">
              <li className="rounded-xl border border-[#e1ebff] bg-white px-3 py-2">Never miss a follow-up</li>
              <li className="rounded-xl border border-[#e1ebff] bg-white px-3 py-2">Track leads through every stage</li>
              <li className="rounded-xl border border-[#e1ebff] bg-white px-3 py-2">Improve team collaboration</li>
              <li className="rounded-xl border border-[#e1ebff] bg-white px-3 py-2">Automate repetitive sales tasks</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/demo">Book a Demo</Link>
              </Button>
              <a
                href={crmVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </motion.section>


      <motion.section id="products" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-16 sm:py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Growth Platform</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4a5a7a]">The first pillar of Velynxia: six integrated products across CRM, Sales, CallCRM, Marketing, Automation, and Analytics.</p>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {solutionCards.map((card) => (
              <motion.article key={card.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f4f9ff_100%)] p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#122443]">{card.title}</h3>
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
                <div className="mt-5">
                  <Link
                    href={card.href}
                    className="inline-flex items-center rounded-md border border-[#cfe0ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c4d87] transition hover:bg-[#f4f8ff]"
                  >
                    Explore {card.title}
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="ai-media-suite" variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
        <div className="rounded-3xl border border-[#dce8ff] bg-[radial-gradient(circle_at_85%_12%,rgba(31,109,255,0.12),transparent_34%),linear-gradient(160deg,#ffffff_0%,#f5f9ff_100%)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Second Platform Pillar</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0e1629] sm:text-4xl">AI Media Suite</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4a5a7a]">
            Create scripts, voiceovers, presentations, podcasts, subtitles, videos, music and AI avatars from one platform.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/ai-media">Open AI Media Suite</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/demo">Request Access</Link>
            </Button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiMediaStudios.map((studio) => (
              <article key={studio.slug} className="rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d6e5ff] bg-[#f8fbff] text-base" aria-hidden="true">
                    {studio.icon}
                  </span>
                  {studio.comingSoon ? (
                    <span className="rounded-full border border-[#ffd8b0] bg-[#fff4e9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a85a1a]">
                      Coming Soon
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-base font-bold text-[#122443]">{studio.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#425375]">{studio.description}</p>
                <div className="mt-4">
                  <Link
                    href={`/ai-media/${studio.slug}`}
                    className="inline-flex items-center rounded-md border border-[#cfe0ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c4d87] transition hover:bg-[#f4f8ff]"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Velynxia?</h2>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyVelynxia.map((item) => (
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
            Book a demo and discover how Velynxia helps SMEs attract, manage and convert customers.
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
              <a href="mailto:info@velynxia.com" className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3158] shadow-sm hover:bg-[#f5f9ff]">
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
