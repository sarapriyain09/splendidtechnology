import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Splendid Technology | Digital Solutions for UK SMEs",
  description:
    "Splendid Technology helps UK engineering and manufacturing SMEs digitize sales, operations, assets, and workflows through practical software systems.",
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    title: "CRM and Sales Systems",
    desc: "Lead capture, quote workflows, and customer management systems that improve conversion and follow-up speed.",
    href: "/services/sales-crm",
  },
  {
    title: "Operations and ERP",
    desc: "Connected operational workflows across jobs, inventory, warehouse movement, and performance reporting.",
    href: "/services/software-development#erp",
  },
  {
    title: "IoT and Asset Intelligence",
    desc: "Condition monitoring and telemetry systems that improve reliability planning and visibility.",
    href: "/services/iot-solutions",
  },
  {
    title: "Digital Intelligence",
    desc: "Data workflows, automation, dashboards, and AI-assisted processes for better decision-making.",
    href: "/services/digital-engineering",
  },
  {
    title: "Advisory and Implementation",
    desc: "Start with an assessment, then roll out high-impact systems in practical, measurable phases.",
    href: "/contact",
  },
];

const detailedScope = [
  {
    heading: "CRM and Sales Systems",
    points: [
      "CRM implementation and migration",
      "Lead capture and follow-up workflows",
      "Quote and customer lifecycle tracking",
      "Commercial process automation",
      "Sales reporting dashboards",
      "Adoption support",
    ],
    href: "/services/sales-crm",
  },
  {
    heading: "Operations and ERP",
    points: [
      "Job and work-order tracking",
      "Inventory and warehouse workflows",
      "ERP module integration",
      "Process and approval automation",
      "Operational KPI dashboards",
      "Supplier and procurement flows",
    ],
    href: "/services/software-development#erp",
  },
  {
    heading: "IoT and Asset Intelligence",
    points: [
      "Condition monitoring systems",
      "Edge device and telemetry setup",
      "Asset performance dashboards",
      "Alerting and escalation rules",
      "Predictive maintenance workflows",
      "Reliability reporting",
    ],
    href: "/services/iot-solutions",
  },
  {
    heading: "Digital Intelligence",
    points: [
      "Data and document workflows",
      "Design and reporting automation",
      "Reliability analytics",
      "AI-assisted operational tasks",
      "Cross-team visibility",
      "Decision support dashboards",
    ],
    href: "/services/digital-engineering",
  },
  {
    heading: "Advisory and Implementation",
    points: [
      "Digitalization assessment",
      "Roadmap and sequencing",
      "Pilot-to-rollout planning",
      "Integration strategy",
      "Team enablement",
      "Managed optimization",
    ],
    href: "/contact",
  },
];

const leadershipTeam = [
  {
    name: "Rajagopalan Saravanan",
    role: "Founder",
    credential: "25+ years international engineering and industrial leadership experience",
    badge: "Founder",
    subtitle: "Founder | Splendid Technology",
    bio: "Rajagopalan Saravanan is an Engineering Leader, Digital Transformation Consultant, and Founder of Splendid Technology, with more than 25 years of international experience spanning electrical engineering, rotating machines, reliability engineering, industrial operations, and technology innovation. Throughout his career, Rajagopalan has held technical and leadership positions with global organisations including GE Vernova, Regal Beloit, and Tecumseh. He has led engineering teams, managed multi-million-dollar projects, supported industrial customers across Oil & Gas, Marine, Mining, Metals, and Manufacturing sectors, and delivered solutions ranging from motor and generator design to asset reliability and condition monitoring. His expertise combines deep industrial engineering knowledge with modern digital technologies including CRM systems, AI-powered business solutions, Industrial IoT, predictive maintenance, and business process automation. Through Splendid Technology, Rajagopalan helps SMEs and industrial organisations improve commercial performance, operational efficiency, and decision-making by connecting people, processes, and technology.",
    skills: [
      "Digital Transformation & Business Process Improvement",
      "CRM Strategy & Implementation",
      "Artificial Intelligence & Workflow Automation",
      "Industrial IoT & Condition Monitoring",
      "Reliability Engineering & Asset Management",
      "Electrical Power Systems",
      "Rotating Machines (Motors & Generators)",
      "Engineering Leadership & Project Management",
    ],
    qualifications: [
      "MBA (Operations), ICFAI University",
      "B.E. Electrical & Electronics Engineering",
      "ISO 9000 Internal Auditor",
      "Six Sigma Green Belt Trained",
    ],
  },
  {
    name: "Shiva Prakhash",
    role: "Technical Delivery Manager",
    credential: "MSc Advanced Computer Science, University of Leicester",
    badge: "Technical Delivery Manager",
    subtitle: "Technical Delivery Manager — Splendid Technology, Leicester, UK",
    bio: "Responsible for the successful delivery of client projects, including website development, hosting, deployment, maintenance, and technical support. Works closely with clients and the business development team to translate requirements into reliable, secure, and scalable digital solutions.",
    skills: [
      "Website Development",
      "Technical Project Delivery",
      "Web Hosting",
      "Deployment and Release Management",
      "Technical Support",
      "System Administration",
      "Cloud Hosting",
      "Website Maintenance",
      "Application Troubleshooting",
      "Performance Optimization",
      "Security and SSL Management",
      "Client Support",
    ],
  },
  {
    name: "Arun Prakash",
    role: "Business Development Manager",
    credential: "MSc International Business, University of Leicester",
    badge: "Business Development Manager",
    subtitle: "Business Development Manager — Splendid Technology, Leicester, UK",
    bio: "Responsible for lead generation, prospect research, CRM management, customer engagement, quotation preparation, and supporting business growth initiatives. Focused on identifying opportunities, understanding customer requirements, nurturing prospects, and helping convert enquiries into business opportunities.",
    skills: [
      "Lead Generation",
      "Prospect Research",
      "CRM Management",
      "Customer Engagement",
      "Quotation Preparation",
      "Appointment Scheduling",
      "Pipeline Development",
      "Follow-Up Management",
      "Opportunity Qualification",
      "Business Growth Support",
      "Client Communication",
      "Sales Coordination",
    ],
  },
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
            A digital solutions company helping engineering and manufacturing SMEs connect sales,
            operations, assets, and workflows into one practical operating model.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            We focus on practical implementation, measurable outcomes, and scalable systems
            that improve reliability, productivity, and operational visibility.
          </p>
        </div>
      </section>

      {/* Service Lines */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">What We Do</h2>
        <p className="mt-2 text-sm text-slate-500">Five digital solution categories with clear implementation scope.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Expanded Scope */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Expanded Delivery Scope</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Each service line includes concrete deliverables so clients can align technical scope,
            budget, and outcomes before implementation begins.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {detailedScope.map((scope) => (
              <div key={scope.heading} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-[#0b1f3a]">{scope.heading}</h3>
                <ul className="mt-4 space-y-2">
                  {scope.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 font-bold text-green-600">+</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href={scope.href} className="mt-5 inline-block text-xs font-semibold uppercase tracking-wide text-green-700 hover:underline">
                  View service details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">Our Approach</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                We focus on practical digitalization rather than generic software rollouts.
                Every project starts with the real operational bottleneck, then maps to the
                minimum viable system change that creates measurable impact.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Our delivery model connects commercial, operational, and asset data so teams
                can make faster decisions with better visibility across the business.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We provide <strong>end-to-end support</strong> &mdash; from assessment and roadmap definition
                through implementation, adoption, and optimization.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">How We Work</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Rapid discovery and scope definition",
                  "Practical implementation with no unnecessary complexity",
                  "Clear workflow and data ownership",
                  "Phased rollout with measurable outcomes",
                  "Visibility at every stage",
                  "Scalable architecture that grows with operations",
                  "Long-term optimization support",
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

      {/* Leadership Team */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Leadership Team</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Delivery and growth leadership focused on practical implementation for UK SMEs.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {leadershipTeam.map((member) => (
              <article key={member.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                {("badge" in member && member.badge) ? (
                  <p className="inline-block rounded-full border border-green-300 bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                    {member.badge}
                  </p>
                ) : null}
                <h3 className="text-lg font-bold text-[#0b1f3a]">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-green-700">{member.role}</p>
                {("subtitle" in member && member.subtitle) ? (
                  <p className="mt-1 text-xs text-slate-500">{member.subtitle}</p>
                ) : null}
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{member.credential}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{member.bio}</p>
                {("skills" in member && member.skills) ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">Key Skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {("qualifications" in member && member.qualifications) ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">Qualifications</p>
                    <ul className="mt-2 space-y-1">
                      {member.qualifications.map((qualification) => (
                        <li key={qualification} className="text-xs text-slate-700">
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Work with us</h2>
          <p className="mt-3 text-slate-300">
            Whether you need CRM, ERP workflows, IoT monitoring, or implementation support,
            we&rsquo;d love to hear about your project.
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
