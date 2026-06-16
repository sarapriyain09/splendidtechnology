import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rajagopalan Saravanan | Founder | Splendid Technology UK",
  description:
    "Rajagopalan Saravanan is a UK-based engineering leader and digital transformation consultant with 25+ years of experience in application engineering, services sales, Salesforce workflows, reliability engineering, rotating machines, CRM, AI, and Industrial IoT.",
  alternates: {
    canonical: "/about/rajagopalan-saravanan",
  },
  keywords: [
    "Rajagopalan Saravanan",
    "Digital Transformation Consultant UK",
    "CRM Consultant UK",
    "Industrial IoT Consultant UK",
    "Reliability Engineering Consultant",
    "Manufacturing Digitalisation",
  ],
  openGraph: {
    title: "Rajagopalan Saravanan | Founder | Splendid Technology UK",
    description:
      "Founder profile: 25+ years across engineering leadership, reliability, rotating machines, asset management, and practical digital transformation for SMEs.",
    type: "profile",
    url: "https://www.splendidtechnology.co.uk/about/rajagopalan-saravanan",
  },
};

const expertise = [
  "Digital Transformation & Business Process Improvement",
  "CRM Strategy & Implementation",
  "Application Engineering",
  "Salesforce CRM and Workflow Design",
  "Technical Services Sales",
  "Artificial Intelligence & Workflow Automation",
  "Industrial IoT & Condition Monitoring",
  "Reliability Engineering & Asset Management",
  "Electrical Power Systems",
  "Rotating Machines (Motors & Generators)",
  "Engineering Leadership & Project Management",
];

const qualifications = [
  "MBA (Operations), ICFAI University",
  "B.E. Electrical & Electronics Engineering",
  "ISO 9000 Internal Auditor",
  "Six Sigma Green Belt Trained",
];

const sectors = [
  "Manufacturing",
  "Oil & Gas",
  "Marine",
  "Mining",
  "Metals",
  "Utilities",
  "Engineering Services",
];

export default function FounderPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rajagopalan Saravanan",
    url: "https://www.splendidtechnology.co.uk/about/rajagopalan-saravanan",
    jobTitle: "Founder",
    worksFor: {
      "@type": "Organization",
      name: "Splendid Technology",
      url: "https://www.splendidtechnology.co.uk",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "ICFAI University",
      },
    ],
    description:
      "Engineering leader and Digital Transformation Consultant with 25+ years of international experience across application engineering, services sales, Salesforce workflow leadership, reliability engineering, rotating machines, asset management, CRM, AI, and Industrial IoT.",
    knowsAbout: [
      "Digital Transformation Consultant UK",
      "CRM Consultant UK",
      "Application Engineering",
      "Salesforce",
      "Services Sales",
      "Industrial IoT Consultant UK",
      "Reliability Engineering",
      "Manufacturing Digitalisation",
      "Rotating Machines",
      "Asset Management",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.splendidtechnology.co.uk/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://www.splendidtechnology.co.uk/about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Rajagopalan Saravanan",
        item: "https://www.splendidtechnology.co.uk/about/rajagopalan-saravanan",
      },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-400">Founder Profile</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Rajagopalan Saravanan</h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            Founder of Splendid Technology and engineering leader with 25+ years of international experience across
            application engineering, services sales, Salesforce-enabled commercial workflows, reliability engineering,
            rotating machines, asset management, and industrial operations across India, France, the Netherlands,
            and the Czech Republic.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
              Digital Transformation Consultant UK
            </span>
            <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
              CRM Consultant UK
            </span>
            <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
              Industrial IoT Consultant UK
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0b1f3a]">Professional Background</h2>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          Rajagopalan Saravanan is an Engineering Leader, Digital Transformation Consultant, and Founder of Splendid
          Technology, with more than 25 years of international experience spanning electrical engineering, rotating
          machines, reliability engineering, industrial operations, and technology innovation.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Throughout his career, Rajagopalan has held technical and leadership positions with global organisations
          including Baker Hughes, GE Power Conversion, Regal Beloit, and Tecumseh. He has led engineering teams,
          managed multi-million-dollar projects, supported industrial customers across Metals, Oil & Gas, Marine,
          Mining, and Manufacturing sectors, and delivered solutions ranging from motor and generator design,
          application engineering, services sales, and Salesforce-enabled commercial process execution to asset
          reliability and condition monitoring.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          His experience also covers end-to-end new product development across design, development, testing,
          services, and sales, with close collaboration across manufacturing, sourcing, and marketing functions in
          both continuous-process and customer-machine production environments.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Through Splendid Technology, he helps SMEs and industrial organisations improve commercial performance,
          operational efficiency, and decision-making by connecting people, processes, and technology through practical
          CRM, AI, Industrial IoT, and workflow automation solutions.
        </p>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-[#0b1f3a]">Key Expertise</h3>
              <ul className="mt-4 space-y-2">
                {expertise.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 font-bold text-green-600">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0b1f3a]">Qualifications</h3>
              <ul className="mt-4 space-y-2">
                {qualifications.map((item) => (
                  <li key={item} className="text-sm text-slate-700">{item}</li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-bold text-[#0b1f3a]">Industries Served</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Work With Splendid Technology</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            If you are looking to improve enquiry-to-quote conversion, operational visibility, reliability performance,
            or connected asset intelligence, our team can help you design and implement a practical roadmap.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Book a Consultation
            </Link>
            <Link
              href="/services/crm-for-manufacturers-uk"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Explore CRM for Manufacturers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
