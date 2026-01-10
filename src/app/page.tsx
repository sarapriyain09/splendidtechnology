import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const CODLEARN_URL = "https://www.codlearn.com/app/";

export const metadata: Metadata = {
  title: "Web Development & AI Automation Company in the UK",
  description:
    "Splendid Technology is a UK web development company (Leicester) building custom web apps, e-commerce websites, automation, and AI integrations for startups and small businesses.",
  keywords: [
    "web development company uk",
    "custom web development uk",
    "web app development uk",
    "ecommerce website development uk",
    "ai integration services uk",
    "automation services for small business uk",
    "web developers leicester uk",
  ],
  alternates: {
    canonical: "/",
  },
};

const services = [
  {
    title: "Web Applications",
    items: [
      "Custom dashboards & portals",
      "SaaS platforms & internal tools",
      "User authentication & role management",
      "Secure backend APIs",
      "Tech: React, Next.js, FastAPI, Node.js, PostgreSQL",
    ],
  },
  {
    title: "E-Commerce Solutions",
    items: [
      "Custom e-commerce websites",
      "Shopify & headless commerce",
      "Payment integration (Stripe, PayPal)",
      "Order, inventory & customer management",
    ],
  },
  {
    title: "Automation & Integrations",
    items: [
      "Business process automation",
      "CRM & lead automation",
      "API integrations (payments, email, analytics)",
      "n8n / workflow automation",
    ],
  },
  {
    title: "AI Integrations",
    items: [
      "AI-powered content generation",
      "Chatbots & copilots",
      "AI-assisted dashboards",
      "Custom integrations using modern LLMs",
    ],
  },
];

const projects = [
  {
    title: "Home-Kitchen UK",
    description: "E-commerce kitchen supplies — mobile-first design, shopping cart.",
    href: "https://home-kitchen.uk/",
    imageSrc: "/images/projects/homekitchen.png",
  },
  {
    title: "MendForWorks",
    description:
      "Mentor–mentee connection platform — profiles, matching, and secure user access.",
    href: "https://www.mendforworks.com/",
    imageSrc: "/images/projects/mendforworks.jpg",
  },
  {
    title: "Kodi Supermarket",
    description:
      "Online supermarket catalog — booking/order system integrated.",
    href: "https://kodisupermarket.co.uk/",
    imageSrc: "/images/projects/kodisupermarket.png",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <section className="bg-[#0b3d91] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:px-8 lg:py-20">
          <div className="w-full max-w-2xl space-y-6">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Custom Web Apps, E-Commerce & AI-Powered Solutions
            </h1>
            <p className="text-pretty text-lg text-white/90">
              We&apos;re a UK web development company (Leicester) building scalable web
              applications, e-commerce platforms, automation systems, and AI
              integrations for startups, small businesses, and growing teams.
            </p>
            <p className="text-pretty text-sm text-white/85">
              From rapid prototypes created with CodLearn to fully custom,
              production-ready systems — we take ideas all the way to deployment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
                href="/#contact"
              >
                Get a Custom App Built
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                href={CODLEARN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore CodLearn (Prototype Faster)
              </a>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/hero/hero.jpg"
                alt="Web development projects and e-commerce builds"
                width={900}
                height={600}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#f7f7f7] p-8">
            <h2 className="text-2xl font-bold text-[#0b3d91]">
              From Idea to Production — Faster
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-black/70">
              We use our own AI-powered platform, CodLearn, to rapidly prototype
              and validate ideas before building them professionally.
            </p>
            <p className="mt-4 text-sm font-bold text-[#0b3d91]">
              What this means for you:
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
              {[
                "Faster project kickoff",
                "Clear scope before development",
                "Reduced cost and rework",
                "Better alignment between idea and final product",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-bold text-[#0b3d91]">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-black/70">
              Have an idea? Start with CodLearn or let us build it for you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center rounded-md bg-[#0b3d91] px-6 py-3 font-bold text-white transition-colors hover:bg-[#08306f]"
                href={CODLEARN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start with CodLearn
              </a>
              <Link
                className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
                href="/#contact"
              >
                Let Splendid Build It
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            Our Services
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl bg-[#f7f7f7] p-8 text-center shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#0b3d91]">
                  {service.title}
                </h3>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  {service.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-bold text-[#0b3d91]">✔</span>
                      <span className="text-black/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            We Work With
          </h2>
          <div className="mt-8 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Small & medium businesses",
              "Startups & founders",
              "Educators & platforms",
              "Agencies needing white-label delivery",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-[#f7f7f7] p-6 text-sm text-black/70"
              >
                <p className="font-bold text-[#0b3d91]">{item}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-black/70">
            If CodLearn helps you generate the idea, we help you deliver it
            professionally.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            Why Choose Splendid Technology
          </h2>
          <div className="mt-10 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              "UK-Based & Reliable",
              "Proven Expertise",
              "Clear Pricing & Scope",
              "Focused on Results",
            ].map((item) => (
              <div key={item} className="rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0b3d91]">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            Our Recent Projects
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.title}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#0b3d91]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/70">
                    {project.description}
                  </p>
                  <a
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-[#ffc107] px-5 py-2 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            How It Works
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-[#f7f7f7] p-8 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#0b3d91]">
                1. Discovery & Scope
              </h3>
              <p className="text-sm text-black/70">
                We clarify goals, users, and requirements (including CodLearn prototypes).
              </p>
            </div>
            <div className="rounded-xl bg-[#f7f7f7] p-8 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#0b3d91]">
                2. Build & Launch
              </h3>
              <p className="text-sm text-black/70">We build, test, and deploy your system.</p>
            </div>
            <div className="rounded-xl bg-[#f7f7f7] p-8 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#0b3d91]">
                3. Grow & Support
              </h3>
              <p className="text-sm text-black/70">Ongoing improvements, support, and scaling.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
              href="/#contact"
            >
              Get a Custom App Built
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-bold text-[#0b3d91]">
              Used CodLearn? We Can Take It Further
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-black/70">
              If you created a project using CodLearn and want custom features,
              better performance, production deployment, or long-term support,
              our team at Splendid Technology can convert your CodLearn project
              into a fully supported business solution.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
              {["Custom features", "Better performance", "Production deployment", "Long-term support"].map(
                (item) => (
                  <li key={item} className="flex gap-2">
                    <span className="font-bold text-[#0b3d91]">✔</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-6">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
                href="/#contact"
              >
                Continue with Splendid Technology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b3d91] py-14 text-center text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Grow Your Business Online?</h2>
          <p className="mt-4 text-lg text-white/90">
            Get a production-ready web app, e-commerce platform, automation, or AI
            integration built for real users.
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
            href="/#contact"
          >
            Get a Custom App Built
          </Link>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">Contact</h2>
          <p className="mt-4 text-sm text-black/70">
            <span className="inline-flex flex-col items-center gap-1 sm:flex-row sm:gap-0">
              <span>
                Email:{" "}
                <a
                  className="text-[#0b3d91] hover:underline"
                  href="mailto:info@splendidtechnology.co.uk"
                >
                  info@splendidtechnology.co.uk
                </a>
              </span>
              <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
              <span>
                Phone:{" "}
                <a className="text-[#0b3d91] hover:underline" href="tel:+447721952967">
                  +44 7721952967
                </a>
              </span>
            </span>
          </p>
          <div className="mt-8">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
              href="/contact"
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

