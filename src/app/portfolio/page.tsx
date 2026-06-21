import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Portfolio | Velynxia",
  description:
    "Real CRM and AI automation platforms delivered by Velynxia for UK SMEs.",
};

const projects = [
  {
    category: "Sales CRM Platform",
    title: "Velynxia CRM",
    summary:
      "A sales CRM platform for lead capture, pipeline tracking, quote workflows, and follow-up automation so teams can convert more enquiries with clear visibility.",
    deliverables: [
      "Lead capture and qualification workflows",
      "Pipeline and deal-stage dashboard",
      "Quote and follow-up task automation",
      "Role-based access and team visibility",
      "Reporting views for conversion tracking",
    ],
    tech: ["Next.js", "CRM Workflow", "Sales Automation", "Dashboard"],
    href: "/services/sales-crm",
    imageSrc: "/images/projects/CRM.png",
  },
  {
    category: "Customer Call Management Platform",
    title: "CallCRM Operations Console",
    summary:
      "A call management web application built for growing teams to route inbound calls, track call outcomes, manage callbacks, and keep customer communication visible in one place.",
    deliverables: [
      "Inbound call routing and queue visibility",
      "Recent calls dashboard with filters",
      "Missed call monitoring and callback actions",
      "Contact-linked call history and notes",
      "Admin controls for teams and dialing workflows",
    ],
    tech: ["Next.js", "Twilio", "CRM Workflow", "Operations Dashboard"],
    href: "/services/call-crm",
    imageSrc: "/images/projects/callcrm.png",
  },
  {
    category: "AI Mentorship Platform",
    title: "MendForWorks",
    summary:
      "A full-stack web application connecting mentees with the right mentor using AI-guided discovery. Users answer structured questions, an AI processes their goals, and the platform matches them with experienced human mentors.",
    deliverables: [
      "AI-guided onboarding flow",
      "Mentor profile & matching system",
      "Secure user authentication",
      "Progress tracking & reflection prompts",
      "Blog & public marketing pages",
    ],
    tech: ["Next.js", "React", "Supabase", "OpenAI API", "Tailwind CSS"],
    href: "https://www.mendforworks.com/",
    imageSrc: "/images/projects/mendforworks.png",
  },
  {
    category: "AI-Powered Learning Platform",
    title: "CodLearn",
    summary:
      "An interactive coding education platform where learners build real apps and websites by chatting with AI. Features a live chat-to-code interface, examples gallery, structured learning paths, and a subscription model.",
    deliverables: [
      "AI chat interface for code generation",
      "Examples showcase gallery",
      "Features & how-it-works pages",
      "Pricing & subscription flow",
      "Blog & support pages",
    ],
    tech: ["Web App", "AI Integration", "Chat UI", "Subscription Billing"],
    href: "https://www.codlearn.com/",
    imageSrc: "/images/projects/codlearn.png",
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Our Work
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            CRM and AI Platforms We&rsquo;ve Built
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Real platforms, live in production. From CRM workflow systems to
            AI-enabled applications &mdash; each project delivered end-to-end by
            Velynxia.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`flex flex-col gap-10 lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Screenshot */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md lg:w-1/2 lg:flex-shrink-0">
                <Image
                  src={project.imageSrc}
                  alt={`${project.title} screenshot`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center lg:w-1/2">
                <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-green-600">
                  {project.category}
                </span>
                <h2 className="text-2xl font-bold text-[#0b1f3a]">
                  {project.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {project.summary}
                </p>

                <ul className="mt-5 space-y-1.5">
                  {project.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-green-500">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#0b1f3a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#162d50]"
                >
                  View Live Site &#8599;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Have a project in mind?</h2>
          <p className="mt-3 text-slate-300">
            We design and implement practical CRM and AI automation systems
            tailored to your business goals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Book a CRM Demo
            </Link>
            <Link
              href="/services/ai-solutions"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              AI Automation Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
