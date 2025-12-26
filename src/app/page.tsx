import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Small Business Websites",
    items: [
      "Mobile-friendly",
      "Booking forms & Google Maps",
      "Fast-loading, optimised for enquiries",
    ],
  },
  {
    title: "Startup MVPs & Web Apps",
    items: [
      "Launch your idea quickly",
      "Dashboards, auth, membership/booking systems",
      "MVP for validation",
    ],
  },
  {
    title: "Advanced Platforms & Client Portals",
    items: [
      "Mentor–mentee platforms, membership portals",
      "Custom dashboards, scalable design",
      "Secure, user-friendly",
    ],
  },
];

const projects = [
  {
    title: "Home-Kitchen UK",
    description: "E-commerce kitchen supplies — mobile-first design, shopping cart.",
    href: "#",
    imageSrc: "/images/projects/homekitchen.png",
  },
  {
    title: "MendForWorks",
    description:
      "Workforce management & booking system — dashboard, multi-user login.",
    href: "#",
    imageSrc: "/images/projects/mendforworks.png",
  },
  {
    title: "Kodi Supermarket",
    description:
      "Online supermarket catalog — booking/order system integrated.",
    href: "#",
    imageSrc: "/images/projects/kodisupermarket.png",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border border-black/10">
        <Image
          src="/images/hero/hero.jpg"
          alt="Splendid Technology banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/15" />
        <div className="relative px-6 py-14 sm:px-10 sm:py-16">
          <div className="max-w-2xl space-y-5 text-white">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Get More Customers with a Professional Website & Web App
            </h1>
            <p className="text-pretty text-base leading-7 text-white/85">
              We help small businesses and startups in the UK grow with
              mobile-friendly websites, booking systems, dashboards, and MVP
              platforms.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
                href="/contact"
              >
                Get Your Free Website Review
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-medium text-white hover:bg-white/15"
                href="/portfolio"
              >
                View Example Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Our Services</h2>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href="/services"
          >
            See all
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          href="/contact"
        >
          See How We Can Help
        </Link>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Why Choose Splendid Technology
        </h2>
        <ul className="mt-4 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
          <li className="rounded-xl border border-black/10 bg-black/[.02] p-4">
            UK-Based & Reliable
          </li>
          <li className="rounded-xl border border-black/10 bg-black/[.02] p-4">
            Proven Expertise (with real projects)
          </li>
          <li className="rounded-xl border border-black/10 bg-black/[.02] p-4">
            Clear Pricing & Scope
          </li>
          <li className="rounded-xl border border-black/10 bg-black/[.02] p-4">
            Focused on Results (leads, enquiries, customers)
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Our Recent Projects</h2>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href="/portfolio"
          >
            Full portfolio
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              className="group rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[.02]"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5">
                <Image
                  src={project.imageSrc}
                  alt={`${project.title} screenshot`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">
                {project.description}
              </p>
              <p className="mt-3 text-sm font-medium text-blue-700 group-hover:underline">
                View project
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
            <p className="text-sm font-semibold">1. Free Website & Platform Review</p>
            <p className="mt-2 text-sm text-black/70">
              Review your current website or idea and identify improvements.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
            <p className="text-sm font-semibold">2. Build & Launch</p>
            <p className="mt-2 text-sm text-black/70">
              Professional website or MVP app — fast, mobile-friendly, optimised.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
            <p className="text-sm font-semibold">3. Grow & Support</p>
            <p className="mt-2 text-sm text-black/70">
              Optional maintenance & updates, and Ads setup for enquiries.
            </p>
          </div>
        </div>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          href="/contact"
        >
          Start Your Free Review Today
        </Link>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Testimonials</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <figure className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
            <blockquote className="text-sm leading-6 text-black/70">
              “Splendid Technology built our booking system in just 3 weeks. Very
              reliable and professional!”
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium">— MendForWorks Team</figcaption>
          </figure>
          <figure className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
            <blockquote className="text-sm leading-6 text-black/70">
              “Our small business website now gets enquiries every day. Excellent
              service!”
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium">— Home-Kitchen UK</figcaption>
          </figure>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-blue-600 px-6 py-10 text-white sm:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to Grow Your Business Online?
            </h2>
            <p className="text-sm text-white/90">
              Get a professional website or MVP web app that brings real enquiries
              and customers.
            </p>
          </div>
          <div className="lg:flex lg:justify-end">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-blue-700 hover:bg-white/90"
              href="/contact"
            >
              Request Free Website Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

