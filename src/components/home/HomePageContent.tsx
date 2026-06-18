"use client";

import { useState } from "react";
import CountUp from "react-countup";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const problemCards = [
  { icon: "LL", title: "Lost Leads", description: "Leads disappear between forms, inboxes, and spreadsheets." },
  { icon: "MF", title: "Manual Follow-Ups", description: "Next steps rely on memory instead of reliable workflows." },
  { icon: "CD", title: "Scattered Customer Data", description: "Customer records live across disconnected platforms." },
  { icon: "DS", title: "Disconnected Systems", description: "Sales and operations work without a shared process." },
  { icon: "PV", title: "Poor Visibility", description: "Decision-makers cannot see the true pipeline picture." },
  { icon: "TS", title: "Too Many Spreadsheets", description: "Complex spreadsheets slow execution and increase errors." },
];

const solutionCards = [
  {
    title: "CRM Solutions",
    items: ["Contact Management", "Sales Pipelines", "Task Management", "Quotations", "Dashboards"],
  },
  {
    title: "AI Automation",
    items: ["AI Assistants", "Workflow Automation", "Email Automation", "SMS Automation"],
  },
  {
    title: "Business Systems",
    items: ["Client Portals", "Internal Tools", "Reporting", "Document Management"],
  },
  {
    title: "Integrations",
    items: ["Outlook", "Gmail", "WhatsApp", "Twilio", "Microsoft 365", "APIs"],
  },
];

const demoCards = [
  { title: "Campaign Planner", image: "/images/projects/CRM%20Campaign%20.png" },
  { title: "Pipeline", image: "/images/projects/CRM%20pipeline.png" },
  { title: "Prospect Finder", image: "/images/projects/crm%20prospect%20finder.png" },
  { title: "Prospects", image: "/images/projects/CRM%20prospects.png" },
  { title: "Prospect Generator", image: "/images/projects/CRM-%20propspect%20generator.png" },
];

const features = [
  { icon: "CM", title: "Customer Management" },
  { icon: "SP", title: "Sales Pipeline" },
  { icon: "ET", title: "Email Templates" },
  { icon: "SM", title: "SMS Messaging" },
  { icon: "TC", title: "Twilio Click-to-Call" },
  { icon: "TM", title: "Task Management" },
  { icon: "AN", title: "Analytics" },
  { icon: "WA", title: "Workflow Automation" },
];

const whySplendid = ["Practical Solutions", "AI-Powered", "Scalable", "Customizable", "Fast Implementation"];

const whyBusinessFeatures = [
  "Customer information in one place",
  "Never miss a follow-up",
  "Track sales opportunities",
  "Improve team collaboration",
  "Automate repetitive tasks",
  "Gain insights through dashboards",
];

const aiAutomationCards = [
  {
    icon: "🤖",
    title: "AI Assistant",
    description: "Generate responses, summarize conversations and support customer interactions.",
  },
  {
    icon: "⚡",
    title: "Workflow Automation",
    description: "Automate repetitive processes and reduce manual work.",
  },
  {
    icon: "📧",
    title: "Email Automation",
    description: "Send follow-ups and nurture leads automatically.",
  },
  {
    icon: "📱",
    title: "SMS and WhatsApp",
    description: "Communicate with customers across multiple channels.",
  },
  {
    icon: "📊",
    title: "Intelligent Reporting",
    description: "Gain insights through dashboards and analytics.",
  },
  {
    icon: "🔗",
    title: "Integrations",
    description: "Connect Outlook, Gmail, Twilio, Microsoft 365, and third-party APIs.",
  },
];

const integrationLogos = ["Outlook", "Microsoft 365", "Gmail", "Twilio", "WhatsApp", "OpenAI", "Google Workspace", "APIs"];

const testimonials = [
  {
    title: "CRM Implementation",
    quote: "Splendid Technology helped us organize our customer data and improve visibility.",
    name: "Operations Manager, Client A",
  },
  {
    title: "Workflow Automation",
    quote: "Manual processes were reduced and follow-up became much easier.",
    name: "Sales Lead, Client B",
  },
  {
    title: "AI Automation",
    quote: "The AI-driven workflows improved productivity across our team.",
    name: "Director, Client C",
  },
];

const stats = [
  { value: 5000, suffix: "+", label: "Leads Managed" },
  { value: 50, suffix: "+", label: "Workflows Automated" },
  { value: 24, suffix: "/7", label: "Business Visibility" },
  { value: 100, suffix: "%", label: "Cloud-Based" },
];

const faqs = [
  {
    q: "What is a CRM?",
    a: "A CRM is a platform that keeps customer data, lead activity, and sales progress in one connected system.",
  },
  {
    q: "Why do SMEs need a CRM?",
    a: "SMEs use CRM to improve follow-up consistency, visibility, and customer management across growing teams.",
  },
  {
    q: "Can CRM automate follow-ups?",
    a: "Yes. CRM can automate reminders, task handoffs, and communication sequences.",
  },
  {
    q: "Does DemoCRM integrate with Outlook?",
    a: "Yes. DemoCRM supports Outlook integrations as part of practical sales workflow setup.",
  },
  {
    q: "Can AI improve customer management?",
    a: "Yes. AI supports response drafting, summaries, and workflow actions to reduce repetitive effort.",
  },
];

const whyBusinessVideoEmbed = "https://www.youtube.com/embed/IjFkPyT6mns";

export function HomePageContent() {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-[var(--background)]">
      <section className="relative border-b border-[#dce8ff] bg-[radial-gradient(circle_at_5%_5%,#d8e7ff_0%,#f8fbff_56%,#fefaf7_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(31,109,255,0.14),transparent_42%)]" />

        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:py-22"
        >
          <div>
            <h1 className="text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl lg:text-6xl">
              CRM for Marketing, Sales, and Customer Management
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37486e]">
              Simplify operations, automate workflows, and build stronger customer relationships with intelligent CRM and AI solutions.
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
              <Link href="/services/sales-crm" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1 hover:bg-[#f3f8ff]">
                CRM Solutions
              </Link>
              <Link href="/services/ai-solutions" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1 hover:bg-[#f3f8ff]">
                AI Automation
              </Link>
              <Link href="/demo" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1 hover:bg-[#f3f8ff]">
                DemoCRM
              </Link>
              <Link href="/blog" className="rounded-full border border-[#d9e6ff] bg-white px-3 py-1 hover:bg-[#f3f8ff]">
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
                <p className="ml-3 text-xs font-semibold text-[#5e6d8f]">CRM Main Page</p>
              </div>
              <Image
                src="/images/projects/CRM%20main%20page.png"
                alt="CRM main page dashboard screenshot in browser frame"
                width={1280}
                height={780}
                className="h-auto w-full rounded-b-2xl object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        variants={sectionFade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="group overflow-hidden rounded-3xl border border-[#dce8ff] bg-white p-3 shadow-[0_16px_42px_rgba(16,39,88,0.14)]">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#dce8ff] bg-[#f8fbff]">
              <iframe
                src={whyBusinessVideoEmbed}
                title="Why growing businesses need a CRM"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(9,24,53,0.12)_0%,rgba(9,24,53,0.38)_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 shadow-lg">
                  <svg className="ml-1 h-7 w-7 text-[#1f6dff]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="self-center">
            <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Growing Businesses Need a CRM</h2>
            <p className="mt-4 text-base leading-7 text-[#44567a]">
              Stop losing leads and automate repetitive tasks. Discover how CRM helps growing businesses improve sales visibility, strengthen customer relationships, and accelerate growth.
            </p>
            <motion.ul variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 grid gap-3 sm:grid-cols-2">
              {whyBusinessFeatures.map((feature) => (
                <motion.li
                  key={feature}
                  variants={cardFade}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 rounded-xl border border-[#e3ecff] bg-white px-3 py-3 text-sm text-[#25385f] shadow-sm transition duration-300 hover:shadow-lg"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e9f4ff] text-[#1d63e0]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.33 7.39a1 1 0 0 1-1.426 0L3.29 9.43a1 1 0 1 1 1.42-1.41l3.955 3.98 6.625-6.68a1 1 0 0 1 1.414-.006z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-7">
              <Button asChild size="lg">
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Problems We Solve</h2>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map((card) => (
            <motion.article key={card.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dbe7ff] bg-white p-5 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[11px] font-bold text-[#215fd6]">{card.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-[#1d3158]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4b5c7e]">{card.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Solutions</h2>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {solutionCards.map((card) => (
              <motion.article key={card.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f4f9ff_100%)] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#122443]">{card.title}</h3>
                <ul className="mt-4 space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-[#425375]">{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">AI-Powered Business Automation</h2>
          <p className="mt-3 text-base text-[#4a5a7a]">Automate repetitive work and focus on growing your business.</p>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiAutomationCards.map((card) => (
              <motion.article key={card.title} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-white p-6 shadow-sm">
                <p className="text-2xl" aria-hidden="true">{card.icon}</p>
                <h3 className="mt-3 text-lg font-bold text-[#1f3158]">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4c5d7f]">{card.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Connect With Your Existing Tools</h2>
        <p className="mt-3 text-sm text-[#4a5a7a]">No rip-and-replace required.</p>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrationLogos.map((logo) => (
            <motion.article key={logo} variants={cardFade} whileHover={{ y: -4 }} className="rounded-xl border border-[#dce8ff] bg-white px-4 py-5 text-center text-sm font-semibold text-[#647391] grayscale transition duration-300 hover:text-[#1f3158] hover:grayscale-0">
              {logo}
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">See DemoCRM in Action</h2>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Request a Walkthrough</Link>
            </Button>
          </div>
        </div>

        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoCards.map((card) => (
            <motion.article key={card.title} variants={cardFade} whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2 }} className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white shadow-sm">
              <div className="border-b border-[#e3edff] bg-[#f8fbff] px-3 py-2">
                <p className="text-xs font-semibold text-[#5e6d8f]">{card.title}</p>
              </div>
              <div className="overflow-hidden">
                <Image src={card.image} alt={`${card.title} screenshot`} width={900} height={620} className="h-44 w-full object-cover transition duration-300 hover:scale-105" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Feature Grid</h2>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={cardFade} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="rounded-2xl border-[#dce8ff] bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[11px] font-bold text-[#215fd6]">{feature.icon}</span>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-base text-[#23365f]">{feature.title}</CardTitle>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Splendid Technology</h2>
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {whySplendid.map((item) => (
            <motion.article key={item} variants={cardFade} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f6fbff_100%)] p-5">
              <p className="text-base font-semibold text-[#182c54]">{item}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">What Our Clients Say</h2>
          <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.title} className="rounded-2xl border-[#dce8ff] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1b3158]">{item.title}</CardTitle>
                  <p className="text-sm text-[#f4b400]">★★★★★</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[#4b5d80]">{item.quote}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#6f7d9a]">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <motion.div variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.article key={stat.label} variants={cardFade} className="rounded-2xl border border-[#dce8ff] bg-white p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-[#1d4fc7]">
                <CountUp end={stat.value} duration={2} enableScrollSpy scrollSpyOnce />
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#425375]">{stat.label}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="border-y border-[#dce8ff] bg-white/70 py-18">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">FAQ</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-[#dce8ff] bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-[#1a3158]">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4b5d80]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#6a96ff] bg-[linear-gradient(120deg,#1a4fcd,#2769ec,#2f7af7)] px-6 py-12 text-white shadow-[0_18px_45px_rgba(30,82,201,0.35)] sm:px-10">
          <motion.div
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.1, 1] }}
            transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl"
          />
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Grow Faster?</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Streamline customer relationships, automate repetitive tasks, and accelerate growth with intelligent CRM solutions.
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
          <button onClick={() => setFabOpen((v) => !v)} className="rounded-full bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#1147bf]">
            {fabOpen ? "Close" : "Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
