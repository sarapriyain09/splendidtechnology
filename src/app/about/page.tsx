import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "react-qr-code";

export const metadata: Metadata = {
  title: "About Splendid Technology | Industrial IoT, Reliability Engineering & Software",
  description:
    "Splendid Technology Ltd — an Industrial Technology & Engineering Solutions company delivering Industry 4.0, Engineering & Product Development, Digital Transformation & Automation, and Software Solutions for UK manufacturers and engineering businesses.",
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    title: "Industry 4.0 & Smart Manufacturing",
    desc: "Industrial IoT, smart motor monitoring, condition monitoring, predictive maintenance, reliability engineering (MTBF, FMEA, RAM, RCM), and IoT proof of concept — grounded in 25+ years of rotating machine expertise.",
    href: "/services/iot-solutions",
  },
  {
    title: "Engineering & Product Development",
    desc: "CAD design & drawings, FEA structural analysis, CFD simulation, reverse engineering, rapid prototyping, and manufacturing support for UK engineering businesses.",
    href: "/services/engineering-manufacturing",
  },
  {
    title: "Digital Transformation & Automation",
    desc: "Process automation, business process digitalisation, workflow automation, data analytics & dashboards, and system integration — connecting ERP, CRM & IoT platforms.",
    href: "/services/software-development",
  },
  {
    title: "Software Solutions",
    desc: "Custom CRM systems, bespoke software development, web applications, mobile applications, and cloud solutions — built with Next.js, React, and modern cloud infrastructure.",
    href: "/services/software-development",
  },
];

const keySkills = [
  // Industrial IoT & Condition Monitoring
  "Motor & Generator Health Monitoring (MV, HV)",
  "Vibration Analysis & Root Cause Analysis",
  "Predictive Maintenance Systems",
  "Condition Monitoring (IoT Edge-to-Cloud)",
  "Industrial Automation & SCADA",
  // Reliability Engineering
  "Reliability Engineering (MTBF, FMEA, RAM, RCM)",
  "ISO 9000 Internal Auditor",
  "Six Sigma Green Belt (GE)",
  "Lean Management & Kaizen",
  // Electrical & Mechanical Engineering
  "MV/HV Induction & Synchronous Motor Design",
  "MV Generator Design & Engineering",
  "Electromagnetic Design (FEMM)",
  "Instrumentation Design & ATEX Certification",
  "3D CAD / 2D Drawing (IDEAS, UG, ProE, Creo)",
  "BOM Creation & PLM (Teamcenter, SAP)",
  "Reverse Engineering",
  // Digital & Software
  "Web Application Development",
  "IoT Dashboard Design",
  "CRM & Business Systems",
  "AI Process Automation",
  "Project & Engineering Management",
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">About Us</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Splendid Technology Ltd</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            An Industrial Technology &amp; Engineering Solutions company serving UK manufacturers nationwide —
            delivering Industry 4.0 &amp; Smart Manufacturing, Engineering &amp; Product Development,
            Digital Transformation &amp; Automation, and Software Solutions for UK manufacturers and engineering businesses.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            Founded on 25+ years of deep expertise in rotating machines, MV motor &amp; generator design,
            condition monitoring, and reliability engineering — combined with modern software development
            to solve real industrial problems.
          </p>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">What We Do</h2>
        <p className="mt-2 text-sm text-slate-500">Four service pillars. One engineering technology partner.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-green-400 hover:shadow-md"
            >
              <h3 className="font-semibold text-[#0b1f3a] group-hover:text-green-700">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.desc}</p>
              <span className="mt-4 inline-block text-xs font-medium text-green-600 group-hover:underline">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">Our Approach</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                We focus on practical, engineering-driven solutions rather than generic platforms.
                Every project starts with understanding the real operational challenge &mdash; then
                we apply the right technology to solve it, whether that&rsquo;s a web app, an IoT
                sensor network, a reliability study, or a piece of custom software.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Our team spans electrical engineering, software engineering, and business development
                &mdash; giving us end-to-end capability from hardware-level monitoring to
                customer-facing SaaS products.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                For website clients, we handle <strong>everything</strong> &mdash; domain registration,
                hosting, SSL certificates, and ongoing maintenance &mdash; so you never have to deal
                with any hosting provider yourself.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">How We Work</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Rapid pilot deployment — prove value fast",
                  "Practical implementation — no over-engineering",
                  "Domain registration, hosting & SSL — fully managed",
                  "Ongoing maintenance & care plans available",
                  "Clear technical visibility at every stage",
                  "Scalable architecture — grows with your business",
                  "Long-term maintainability — built to last",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team heading */}
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">The Team</h2>
        <p className="mt-1 text-sm text-slate-500">The engineers and specialists behind Splendid Technology.</p>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">

      <section className="rounded-2xl border border-[#0b3d91]/20 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0b3d91]/60">
                Founder &amp; Engineering Technology Lead
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Raja Saravanan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Founder &amp; Engineering Technology Lead — Splendid Technology, UK
              </p>
              <a href="mailto:raja@splendidtechnology.co.uk" className="text-xs text-[#0b3d91] hover:underline">raja@splendidtechnology.co.uk</a>
            </div>
            <p className="text-sm leading-6 text-black/70">
              Engineering Technology leader with 25+ years of expertise spanning Medium Voltage
              motor &amp; generator design, application engineering, condition monitoring, and
              reliability engineering for Oil &amp; Gas, Marine, Metal, and Mining industries globally.
            </p>
            <p className="text-sm leading-6 text-black/70">
              At Splendid Technology, Raja combines this deep industrial expertise with modern
              web development, IoT, and software automation to build solutions that genuinely solve
              manufacturing and engineering challenges — from smart motor health monitoring platforms
              to custom CRM and business software.
            </p>
            <p className="text-sm leading-6 text-black/70">
              Previously Senior Services Engineering Manager at GE Power Conversion, leading
              rotating machine services for ASIA P&amp;L across motors and generators rated 1MW–400MW
              for Oil &amp; Gas, Marine, Metal &amp; Mining customers.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "MBA (Operations) — ICFAI University",
                "BE Electrical & Electronics — Madurai Kamaraj University",
                "ISO 9000:2001 Internal Auditor",
                "Six Sigma Green Belt (GE Crotonville)",
                "Instrumentation Design Training — Nancy, France",
                "Electrical Design Training — Cranfield University, UK",
                "MV Motor Design — Rotating Machines, Rugby, UK",
                "Lean Management & Kaizen (GE)",
              ].map((cred) => (
                <span
                  key={cred}
                  className="rounded-full border border-[#0b3d91]/20 bg-[#f0f4ff] px-3 py-1 text-xs text-[#0b3d91]"
                >
                  {cred}
                </span>
              ))}
            </div>
          </div>

          {/* Key Skills */}
          <div className="w-full shrink-0 lg:w-64">
            <h3 className="text-sm font-semibold text-[#0b3d91]">Key Skills</h3>
            <ul className="mt-3 space-y-2">
              {keySkills.map((skill) => (
                <li key={skill} className="flex items-start gap-2 text-xs text-black/70">
                  <span className="mt-0.5 shrink-0 font-bold text-[#0b3d91]">✔</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <div>
        <h2 className="text-lg font-semibold text-[#0b1f3a]">The Team</h2>
        <p className="mt-1 text-sm text-black/50">The engineers and specialists behind Splendid Technology.</p>
      </div>

      {/* Shiva — Technical Delivery Manager */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0b3d91]/60">
                Technical Delivery Manager
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Shiva Prakash Saravanan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Technical Delivery Manager — Splendid Technology, UK
              </p>
              <a href="mailto:shiva@splendidtechnology.co.uk" className="text-xs text-[#0b3d91] hover:underline">shiva@splendidtechnology.co.uk</a>
            </div>
            <p className="text-sm leading-6 text-black/70">
              Responsible for the successful delivery of client projects, including website
              development, hosting, deployment, maintenance, and technical support. Works
              closely with clients and the business development team to translate requirements
              into reliable, secure, and scalable digital solutions.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "MSc Advanced Computer Science — University of Leicester",
                "BSc Computer Science — SRM University (First Class, Distinction)",
                "2+ yrs Software Engineering (Phumber India)",
                "Live: CodLearn · MendForWorks",
              ].map((cred) => (
                <span
                  key={cred}
                  className="rounded-full border border-[#0b3d91]/20 bg-[#f0f4ff] px-3 py-1 text-xs text-[#0b3d91]"
                >
                  {cred}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-64">
            <h3 className="text-sm font-semibold text-[#0b3d91]">Key Skills</h3>
            <ul className="mt-3 space-y-2">
              {[
                "Website Development",
                "Technical Project Delivery",
                "Web Hosting",
                "Deployment & Release Management",
                "Technical Support",
                "System Administration",
                "Cloud Hosting",
                "Website Maintenance",
                "Application Troubleshooting",
                "Performance Optimisation",
                "Security & SSL Management",
                "Client Support",
              ].map((skill) => (
                <li key={skill} className="flex items-start gap-2 text-xs text-black/70">
                  <span className="mt-0.5 shrink-0 font-bold text-[#0b3d91]">✔</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project highlights */}
        <div className="mt-6 border-t border-black/5 pt-5">
          <h3 className="text-sm font-semibold text-[#0b3d91]">Notable Projects</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "Kubernetes Distributed System",
                detail: "3-node K3s cluster · 93% Docker image reduction · <50ms latency",
              },
              {
                name: "AI-Driven K8s Scheduling Research",
                detail: "RL algorithms (Q-learning, DQN, PPO, LSTM, MARL) · 20–35% resource improvement",
              },
              {
                name: "MongoDB Atlas Performance",
                detail: "Query caching: 48s → 29ms · .explain() optimisation",
              },
              {
                name: "LSTM Workload Prediction",
                detail: "Cloud workload time-series model · Python / Machine Learning",
              },
            ].map((p) => (
              <div key={p.name} className="rounded-lg bg-[#f7f9ff] p-3">
                <p className="text-xs font-semibold text-black">{p.name}</p>
                <p className="mt-0.5 text-xs text-black/55">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arun — Business Development Manager */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0b3d91]/60">
                Business Development Manager
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Arun Prakash Rajagopalan Saravanan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Business Development Manager — Splendid Technology, Leicester, UK
              </p>
              <a href="mailto:arun@splendidtechnology.co.uk" className="text-xs text-[#0b3d91] hover:underline">arun@splendidtechnology.co.uk</a>
            </div>
            <p className="text-sm leading-6 text-black/70">
              Responsible for lead generation, prospect research, CRM management, customer
              engagement, quotation preparation, and supporting business growth initiatives.
              Focused on identifying opportunities, understanding customer requirements,
              nurturing prospects, and helping convert enquiries into business opportunities.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "MSc International Business — University of Leicester (2026)",
                "BBA — SRM University (2024)",
                "Supply Chain Intern — L&T Valves",
                "Certified: Supply Chain Management (Coursera)",
                "Cambridge English Certificate",
              ].map((cred) => (
                <span
                  key={cred}
                  className="rounded-full border border-[#0b3d91]/20 bg-[#f0f4ff] px-3 py-1 text-xs text-[#0b3d91]"
                >
                  {cred}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-64">
            <h3 className="text-sm font-semibold text-[#0b3d91]">Key Skills</h3>
            <ul className="mt-3 space-y-2">
              {[
                "Lead Generation & Pipeline Management",
                "CRM (In-house) — Leads, Quotes & Follow-ups",
                "Segment-wise Customer Research & Analysis",
                "Prospect Engagement & Conversion",
                "Quote Preparation & Proposal Writing",
                "Market Mapping & Competitor Analysis",
                "Cross-functional Collaboration",
                "Market Entry & Strategic Analysis",
              ].map((skill) => (
                <li key={skill} className="flex items-start gap-2 text-xs text-black/70">
                  <span className="mt-0.5 shrink-0 font-bold text-[#0b3d91]">✔</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project highlights */}
        <div className="mt-6 border-t border-black/5 pt-5">
          <h3 className="text-sm font-semibold text-[#0b3d91]">Notable Projects</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "J&J Global Supply Chain Analysis",
                detail: "Evaluated demand planning, sourcing, distribution, and regulatory risk for J&J global operations",
              },
              {
                name: "GE Vietnam Supply Chain Strategy",
                detail: "Analysed market entry, supply chain setup, and workforce operational challenges",
              },
            ].map((p) => (
              <div key={p.name} className="rounded-lg bg-[#f7f9ff] p-3">
                <p className="text-xs font-semibold text-black">{p.name}</p>
                <p className="mt-0.5 text-xs text-black/55">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>{/* end team wrapper */}

      {/* QR Code */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-10 text-center sm:flex-row sm:text-left">
            <div className="shrink-0 rounded-xl bg-white p-4 shadow-sm">
              <QRCode
                value="https://splendidtechnology.co.uk"
                size={140}
                fgColor="#0b1f3a"
                bgColor="#ffffff"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600">Quick Access</p>
              <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">Scan to Visit Our Website</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Point your phone camera at the QR code to open{" "}
                <span className="font-medium text-[#0b1f3a]">splendidtechnology.co.uk</span>{" "}
                instantly &mdash; no typing required.
              </p>
              <p className="mt-1 text-xs text-slate-400">splendidtechnology.co.uk</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Work with us</h2>
          <p className="mt-3 text-slate-300">
            Whether you need a web app, an IoT monitoring system, a reliability study, or bespoke
            software &mdash; we&rsquo;d love to hear about your project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get in Touch
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
