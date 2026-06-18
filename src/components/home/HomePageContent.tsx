"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const problems = [
  "Lost Leads",
  "Scattered Customer Data",
  "Manual Follow-Ups",
  "Disconnected Systems",
  "Poor Visibility",
];

const solutionColumns = [
  {
    heading: "CRM Solutions",
    items: ["Lead Management", "Sales Pipelines", "Contact Management", "Quotations", "Dashboards"],
  },
  {
    heading: "AI Automation",
    items: ["Workflow Automation", "Email Automation", "SMS Automation", "AI Assistants"],
  },
  {
    heading: "Business Systems",
    items: ["Client Portals", "Internal Tools", "Reporting", "Document Management"],
  },
];

const demoCards = [
  { title: "Pipeline", image: "/images/projects/callcrm.png" },
  { title: "Contacts", image: "/images/projects/CRM.png" },
  { title: "Dashboard", image: "/images/projects/ERP.png" },
  { title: "Activities", image: "/images/projects/warehousemanagement.png" },
  { title: "Reports", image: "/images/projects/callcrm.png" },
];

const features = [
  "Customer Management",
  "Sales Pipeline",
  "Email Templates",
  "SMS Integration",
  "Task Management",
  "Reporting",
  "Workflow Automation",
  "Analytics",
];

const whySplendid = ["Practical Solutions", "AI Powered", "Scalable", "Customizable", "Fast Implementation"];

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
      <section className="relative border-b border-[#dce8ff] bg-[radial-gradient(circle_at_0%_0%,#d7e6ff_0%,#f7fbff_55%,#fefaf7_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(226,95,36,0.12),transparent_40%)]" />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:px-8 lg:py-24"
        >
          <div>
            <p className="inline-flex rounded-full border border-[#ffc9ae] bg-white/90 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#cc551f]">
              CRM + AI Automation for SMEs
            </p>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-[#0e1629] sm:text-5xl lg:text-6xl">
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

          <div className="rounded-3xl border border-[#d9e6ff] bg-white p-3 shadow-[0_18px_50px_rgba(13,36,84,0.16)]">
            <div className="rounded-2xl border border-[#dce8ff] bg-[#f8fbff]">
              <div className="flex items-center gap-2 border-b border-[#e3edff] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff7d51]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffc54a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#59c88a]" />
                <p className="ml-3 text-xs font-semibold text-[#5e6d8f]">DemoCRM Dashboard</p>
              </div>
              <Image
                src="/images/projects/callcrm.png"
                alt="DemoCRM dashboard screenshot"
                width={1280}
                height={780}
                className="h-auto w-full rounded-b-2xl object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:items-center">
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
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(9,24,53,0.16)_0%,rgba(9,24,53,0.38)_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <svg className="ml-1 h-7 w-7 text-[#e25f24]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Why SMEs Need a CRM</h2>
            <p className="mt-4 text-base leading-7 text-[#44567a]">
              Discover how a CRM helps small businesses organize customer information, automate follow-ups, improve sales visibility, and accelerate growth.
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
        id="problem"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Are manual processes slowing your business?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {problems.map((problem) => (
            <motion.article
              key={problem}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[#dbe7ff] bg-white p-5 shadow-sm"
            >
              <p className="text-base font-semibold text-[#20345f]">{problem}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="solutions"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="border-y border-[#dce8ff] bg-white/70 py-18"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Solutions</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {solutionColumns.map((column) => (
              <motion.article
                key={column.heading}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#dce8ff] bg-[linear-gradient(160deg,#ffffff_0%,#f3f8ff_100%)] p-6"
              >
                <h3 className="text-xl font-bold text-[#122443]">{column.heading}</h3>
                <ul className="mt-4 space-y-2">
                  {column.items.map((item) => (
                    <li key={item} className="text-sm text-[#425375]">{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="products"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">DemoCRM Product View</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4a5a7a]">
              Explore core product screens that teams use daily to manage leads, sales, and customer activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/demo">Request Demo</Link>
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
              <Image src={card.image} alt={`${card.title} screenshot`} width={900} height={620} className="h-44 w-full object-cover" />
              <p className="px-4 py-3 text-sm font-semibold text-[#20345f]">{card.title}</p>
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
          <h2 className="text-3xl font-bold text-[#0e1629] sm:text-4xl">Features</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.article
                key={feature}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#dce8ff] bg-white p-5"
              >
                <p className="text-sm font-semibold text-[#23365f]">{feature}</p>
              </motion.article>
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
        className="border-t border-[#dce8ff] bg-[linear-gradient(120deg,#0f2041,#17346d)] py-18 text-white"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to streamline your business?</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Build a modern CRM and automation foundation for faster growth, better follow-up, and clearer execution.
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
