import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Portfolio & Case Studies | Splendid Technology",
  description:
    "Anonymized engineering case studies and real web platforms delivered by Splendid Technology, from dynamic analysis and CFD to AI-powered applications.",
};

const projects = [
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
    category: "Food Ordering & Catering Website",
    title: "Home Kitchen UK",
    summary:
      "A mobile-first food ordering and catering website for a UK-based home kitchen. Built around a rich menu experience with combo builder, individual meal pages, and a catering enquiry system for events and office lunches.",
    deliverables: [
      "Multi-page menu (Veg, Non-Veg, Combo, Meals)",
      "Catering enquiry & contact form",
      "Today's highlights section",
      "Mobile-first responsive design",
      "Light red & maroon brand identity",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    href: "https://www.home-kitchen.uk/",
    imageSrc: "/images/projects/homekitchen.png",
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

const engineeringCaseStudies = [
  {
    category: "Structural Dynamics",
    title: "Generator Frame Dynamic Analysis",
    challenge:
      "A manufacturer required verification of a generator support structure to ensure operating frequencies would not coincide with structural natural frequencies.",
    scope: [
      "Finite element model development of generator frame",
      "Modal analysis for natural frequencies and mode shapes",
      "Harmonic response analysis",
      "Vibration behaviour evaluation under operating conditions",
    ],
    activities: [
      "Structural modelling",
      "Boundary condition definition",
      "Modal analysis",
      "Harmonic response simulation",
      "Engineering assessment",
    ],
    outcome: [
      "Identified critical vibration modes",
      "Verified structural suitability for operating conditions",
      "Provided recommendations to minimise resonance risk",
    ],
    expertise: [
      "Dynamic FEA",
      "Modal Analysis",
      "Harmonic Response Analysis",
      "Rotating Equipment Engineering",
    ],
    imageSrc: null,
  },
  {
    category: "Rotor Dynamics",
    title: "Rotor Dynamic Analysis of High-Speed Machinery",
    challenge:
      "A rotating equipment manufacturer required evaluation of rotor dynamic behaviour for a machine and associated drive train.",
    scope: [
      "Rotor lateral critical speed analysis",
      "Drive train dynamic assessment",
      "Stability evaluation",
      "Operating speed verification",
    ],
    activities: [
      "Rotor modelling",
      "Bearing system representation",
      "Critical speed determination",
      "Campbell diagram generation",
      "Stability assessment",
    ],
    outcome: [
      "Identified critical speed locations",
      "Confirmed operating speed separation margins",
      "Reduced risk of vibration-related operational issues",
    ],
    expertise: [
      "Rotor Dynamics",
      "Rotordynamic Simulation",
      "Critical Speed Analysis",
      "Drive Train Engineering",
    ],
    imageSrc: null,
  },
  {
    category: "CFD & Thermal",
    title: "CFD Analysis of Flywheel Energy Storage System",
    challenge:
      "A development team required prediction of thermal behaviour and aerodynamic losses within a flywheel system.",
    scope: [
      "CFD model development",
      "Thermal analysis",
      "Loss prediction",
      "Temperature rise assessment",
    ],
    activities: [
      "Geometry preparation",
      "CFD simulation",
      "Thermal performance evaluation",
      "Loss mechanism assessment",
    ],
    outcome: [
      "Predicted operating temperature profile",
      "Quantified system losses",
      "Supported design optimisation activities",
    ],
    expertise: [
      "CFD Analysis",
      "Thermal Engineering",
      "Energy Storage Systems",
      "Performance Optimisation",
    ],
    imageSrc: null,
  },
  {
    category: "Reverse Engineering",
    title: "Reverse Engineering of Legacy Components",
    challenge:
      "A customer required replacement of legacy equipment components where original CAD models and drawings were unavailable.",
    scope: [
      "3D scanning of existing components",
      "CAD reconstruction",
      "Manufacturing drawing generation",
      "Design validation",
    ],
    activities: [
      "Laser/3D scanning",
      "Point cloud processing",
      "Surface reconstruction",
      "CAD model development",
      "Drawing package creation",
    ],
    outcome: [
      "Accurate digital model of legacy component",
      "Manufacturing-ready documentation",
      "Reduced downtime and replacement lead time",
    ],
    expertise: [
      "Reverse Engineering",
      "3D Scanning",
      "CAD Reconstruction",
      "Legacy Equipment Support",
    ],
    imageSrc: null,
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
            Web Apps We&rsquo;ve Built
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Real platforms, live in production. From AI-powered SaaS tools to
            food ordering sites &mdash; each project delivered end-to-end by
            Splendid Technology.
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

      {/* Advanced Engineering Case Studies */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#0b3d91]">
            Advanced Engineering Analysis
          </p>
          <h2 className="text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
            Anonymized Case Studies
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These projects are presented without customer-identifying details,
            while showing our approach to complex analysis, diagnostics,
            and decision support in industrial environments.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {engineeringCaseStudies.map((study) => (
            <article
              key={study.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid gap-0 lg:grid-cols-5">
                <div className="relative min-h-56 border-b border-slate-200 bg-slate-50 lg:col-span-2 lg:border-b-0 lg:border-r">
                  {study.imageSrc ? (
                    <Image
                      src={study.imageSrc}
                      alt={`${study.title} visual`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      Image placeholder. Add a relevant project visual when
                      available.
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 lg:col-span-3">
                  <span className="inline-block rounded-full bg-[#e8eef9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                    {study.category}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-[#0b1f3a]">
                    {study.title}
                  </h3>

                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">Challenge</p>
                      <p>{study.challenge}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Scope</p>
                      <ul className="mt-1 space-y-1">
                        {study.scope.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Activities</p>
                      <ul className="mt-1 space-y-1">
                        {study.activities.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Outcome</p>
                      <ul className="mt-1 space-y-1">
                        {study.outcome.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#16a34a]">&#10003;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {study.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#d8e2f3] bg-[#f7faff] p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[#0b1f3a]">Specialist Service Areas</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Our engineering portfolio focuses on high-value analysis work that
            supports reliability, performance, and risk reduction in industrial
            systems.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Structural Dynamics</p>
              <p className="mt-1 text-sm text-slate-700">
                Modal analysis, harmonic response, vibration assessment, and
                resonance evaluation.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Rotor Dynamics</p>
              <p className="mt-1 text-sm text-slate-700">
                Critical speed analysis, lateral rotor behaviour, drive train
                dynamics, and stability assessment.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">CFD &amp; Thermal Analysis</p>
              <p className="mt-1 text-sm text-slate-700">
                Flow analysis, thermal prediction, loss estimation, and
                performance optimisation.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Reverse Engineering</p>
              <p className="mt-1 text-sm text-slate-700">
                3D scanning, CAD reconstruction, legacy component modelling,
                and manufacturing documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Have a project in mind?</h2>
          <p className="mt-3 text-slate-300">
            We design and build web apps from scratch &mdash; tailored to your
            business, ready to scale.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Start a Project
            </Link>
            <Link
              href="/services/web-app-development"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Web &amp; App Development
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
