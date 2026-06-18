"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const problemCards = [
  {
    icon: "LL",
    title: "Lost Leads",
    description: "Leads drop between channels, inboxes, and manual handovers.",
  },
  {
    icon: "MF",
    title: "Manual Follow-Ups",
    description: "Important next steps depend on memory and inconsistent routines.",
  },
  {
    icon: "CD",
    title: "Scattered Customer Data",
    description: "Customer information is fragmented across disconnected tools.",
  },
  {
    icon: "DS",
    title: "Disconnected Systems",
    description: "Sales, support, and operations work without a shared workflow.",
  },
  {
    icon: "PV",
    title: "Poor Visibility",
    description: "Teams cannot clearly see pipeline health and deal progress.",
  },
  {
    icon: "TS",
    title: "Too Many Spreadsheets",
    description: "Spreadsheet-heavy processes slow decisions and create errors.",
  },
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
  { title: "Pipeline", image: "/images/projects/callcrm.png" },
  { title: "Dashboard", image: "/images/projects/ERP.png" },
  { title: "Contacts", image: "/images/projects/CRM.png" },
  { title: "Activities", image: "/images/projects/warehousemanagement.png" },
  { title: "Reports", image: "/images/projects/callcrm.png" },
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

const testimonials = [
  {
    company: "Northfield Components",
    quote: "Splendid helped us centralize sales and automate follow-up in weeks.",
    rating: 5,
  },
  {
    company: "Apex Trade Supplies",
    quote: "Pipeline visibility improved immediately and our response speed increased.",
    rating: 5,
  },
  {
    company: "Bluewater Services",
    quote: "The CRM rollout was practical, clear, and easy for the team to adopt.",
    rating: 5,
  },
];

const whySmeFeatures = [
  "Customer information in one place",
  "Never miss a follow-up",
  "Track sales opportunities",
  "Improve team collaboration",
  "Automate repetitive tasks",
  "Gain insights through dashboards",
];

const whySmeVideoEmbed = "https://www.youtube.com/embed/IjFkPyT6mns";

export function HomePageContent() {
  return (
    <div className="relative overflow-hidden bg-[var(--background)]">
      <section className="relative border-b border-[#dce8ff] bg-[radial-gradient(circle_at_5%_5%,#d8e7ff_0%,#f8fbff_56%,#fefaf7_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(31,109,255,0.14),transparent_42%)]" />

        <motion.div
          variants={fadeInUp}
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
                <p className="ml-3 text-xs font-semibold text-[#5e6d8f]">DemoCRM Dashboard</p>
              </div>
              <Image
                src="/images/projects/callcrm.png"
                alt="DemoCRM dashboard screenshot in browser frame"
                width={1280}
                height={780}
                className="h-auto w-full rounded-b-2xl object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="group overflow-hidden rounded-3xl border border-[#dce8ff] bg-white p-3 shadow-[0_16px_42px_rgba(16,39,88,0.14)]">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#dce8ff] bg-[#f8fbff]">
              <iframe
                src={whySmeVideoEmbed}
                title="Why SMEs need a CRM"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(9,24,53,0.15)_0%,rgba(9,24,53,0.4)_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 shadow-lg">
                  <svg className="ml-1 h-7 w-7 text-[#1f6dff]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why SMEs Need a CRM</h2>
            <p className="mt-4 text-base leading-7 text-[#44567a]">
              Discover how CRM helps small businesses organize customer information, automate follow-ups, improve sales visibility, and accelerate growth.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {whySmeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 rounded-xl border border-[#e3ecff] bg-white px-3 py-3 text-sm text-[#25385f]">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e9f4ff] text-[#1d63e0]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.33 7.39a1 1 0 0 1-1.426 0L3.29 9.43a1 1 0 1 1 1.42-1.41l3.955 3.98 6.625-6.68a1 1 0 0 1 1.414-.006z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button asChild size="lg">
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Problems We Solve</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map((card) => (
            <motion.article
              key={card.title}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[#dbe7ff] bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[11px] font-bold text-[#215fd6]">
                {card.icon}
              </span>
              <h3 className="mt-3 text-lg font-bold text-[#1d3158]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4b5c7e]">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="border-y border-[#dce8ff] bg-white/70 py-18"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Solutions</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {solutionCards.map((card) => (
              <motion.article
                key={card.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f4f9ff_100%)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#122443]">{card.title}</h3>
                <ul className="mt-4 space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-[#425375]">{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">See DemoCRM in Action</h2>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services/sales-crm">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoCards.map((card) => (
            <motion.article
              key={card.title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white shadow-sm"
            >
              <div className="border-b border-[#e3edff] bg-[#f8fbff] px-3 py-2">
                <p className="text-xs font-semibold text-[#5e6d8f]">{card.title}</p>
              </div>
              <Image src={card.image} alt={`${card.title} screenshot`} width={900} height={620} className="h-44 w-full object-cover" />
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="border-y border-[#dce8ff] bg-white/70 py-18"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Feature Grid</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="rounded-2xl border-[#dce8ff] bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[11px] font-bold text-[#215fd6]">
                      {feature.icon}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-base text-[#23365f]">{feature.title}</CardTitle>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why Splendid Technology</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {whySplendid.map((item) => (
            <motion.article
              key={item}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f6fbff_100%)] p-5"
            >
              <p className="text-base font-semibold text-[#182c54]">{item}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="border-y border-[#dce8ff] bg-white/70 py-18"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Testimonials</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.company} className="rounded-2xl border-[#dce8ff] bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#edf4ff] text-[11px] font-bold text-[#1f61d9]">
                      {item.company.slice(0, 2).toUpperCase()}
                    </span>
                    <p className="text-sm font-semibold text-[#1b3158]">{item.company}</p>
                  </div>
                  <p className="text-sm text-[#f4b400]">{"★".repeat(item.rating)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[#4b5d80]">{item.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="border-t border-[#dce8ff] bg-[linear-gradient(120deg,#0f2041,#17346d)] py-18 text-white"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Streamline Your Business?</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Automate workflows, improve visibility, and accelerate growth with CRM and AI solutions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/demo">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/35 bg-transparent text-white hover:bg-white/12">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
