import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Splendid Technology | Web Apps, IoT, Reliability & Software",
  description:
    "Splendid Technology Ltd (Leicester, UK) — a four-pillar technology company delivering Web & App Development, Industrial IoT Solutions, Reliability Engineering, and SaaS Software Products for UK businesses.",
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    title: "Web & App Development",
    desc: "Custom websites, SaaS platforms, customer portals, and API integrations — built with Next.js, React, and modern cloud infrastructure.",
    href: "/services/web-app-development",
  },
  {
    title: "IoT & Condition Monitoring",
    desc: "Edge-to-cloud industrial monitoring for motors, energy systems, and rotating machinery — real-time dashboards, vibration analysis, and predictive alerts.",
    href: "/services/iot-solutions",
  },
  {
    title: "Reliability Engineering",
    desc: "MTBF calculations, FMEA/FMECA, RAM studies, RCM, and maintenance interval optimisation — grounded in 25+ years of real engineering practice.",
    href: "/services/reliability-engineering",
  },
  {
    title: "Software & SaaS Products",
    desc: "Purpose-built software for engineering businesses: Splendid Accounting, Splendid Reliability, Splendid Monitor, and Splendid Asset Manager.",
    href: "/products",
  },
];

const keySkills = [
  "MV Motor & Generator Design (1MW–400MW)",
  "Predictive Maintenance & Condition Monitoring",
  "Electromagnetic & Mechanical Design",
  "Instrumentation Design & ATEX Certification",
  "Industrial IoT & Industry 4.0 Solutions",
  "Engineering Operations & Project Management",
  "Root Cause Analysis & Failure Diagnostics",
  "LEAN, ISO 9000 & Six Sigma (Green Belt)",
  "New Product Development & Team Leadership",
  "3D/2D CAD: IDEAS / UG / ProE / Creo",
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
            A Leicester-based technology company delivering Web Applications, Industrial IoT Solutions,
            Reliability Engineering Services, and SaaS Software Products for UK businesses and
            industrial organisations.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            We combine 25+ years of deep engineering domain expertise with modern software
            development to solve real problems &mdash; from building customer-facing web apps to
            monitoring motor health on the factory floor.
          </p>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">What We Do</h2>
        <p className="mt-2 text-sm text-slate-500">Four service areas. One technology partner.</p>
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">How We Work</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Rapid pilot deployment — prove value fast",
                  "Practical implementation — no over-engineering",
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
                Founder &amp; Lead Engineer
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Saravanan Rajagopalan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Engineering Manager — Leicester, United Kingdom
              </p>
            </div>
            <p className="text-sm leading-6 text-black/70">
              With over 25 years of engineering experience spanning motor and
              generator design, application engineering, and Industrial IoT,
              Saravanan brings deep technical credibility to every project
              Splendid Technology undertakes. His career spans global
              organisations including GE Power Conversion and Baker Hughes
              (Brush Power Generation), with specialisation in Medium Voltage
              rotating machines from 1MW to 400MW.
            </p>
            <p className="text-sm leading-6 text-black/70">
              This real-world domain expertise — in predictive maintenance,
              condition monitoring, instrumentation design, and Industry 4.0 —
              directly informs the Industrial IoT and smart monitoring solutions
              we deliver to manufacturers and engineers across the UK.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "MBA (Operations) — ICFAI University",
                "BE Electrical & Electronics — Madurai Kamaraj University",
                "ISO 9000 Internal Auditor",
                "Six Sigma Green Belt (GE)",
                "Training: Cranfield University & Nancy, France",
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

      {/* Shiva — Software Expert */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0b3d91]/60">
                Software Expert
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Shiva Prakash Saravanan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Software Engineer · Cloud & AI — Leicester, UK
              </p>
            </div>
            <p className="text-sm leading-6 text-black/70">
              MSc Advanced Computer Science student at the University of Leicester,
              specialising in cloud-native systems, distributed computing, and
              AI-driven optimisation. With 2+ years of production software
              engineering experience at Phumber India Private Ltd and hands-on
              projects in Kubernetes, AI scheduling, and system design, Shiva is
              the technical builder behind live Splendid Technology platforms
              including CodLearn and MendForWorks.
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
                "Python, C++, Java",
                "Kubernetes, Docker, Vercel, Render",
                "MongoDB, REST APIs",
                "Microservices & Distributed Systems",
                "AI / ML — LSTM, RL algorithms",
                "System Design & UML",
                "Git, GitHub, GitHub Copilot",
                "Cloud-native performance optimisation",
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

      {/* Arun — Business Development */}
      <section className="rounded-2xl border border-[#0b3d91]/20 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0b3d91]/60">
                Business Development
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#0b3d91]">
                Arun Prakash Rajagopalan Saravanan
              </h2>
              <p className="text-sm font-medium text-black/60">
                Supply Chain & Operations · International Business — Leicester, UK
              </p>
            </div>
            <p className="text-sm leading-6 text-black/70">
              MSc International Business student at the University of Leicester,
              specialising in supply chain, logistics, operations, and
              sustainability. Arun brings structured analytical thinking and
              cross-functional communication skills to Splendid Technology&apos;s
              business development efforts — connecting technical solutions to
              client needs, markets, and growth opportunities.
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
                "Supply Chain Operations & Logistics",
                "Inventory Management & Demand Planning",
                "Process Improvement & Operational Efficiency",
                "Data Analysis (Excel — Pivot Tables, VLOOKUP)",
                "Risk Assessment & Mitigation",
                "Sustainability in Supply Chains",
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
