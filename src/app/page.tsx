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
    href: "https://home-kitchen.uk/",
    imageSrc: "/images/projects/homekitchen.png",
  },
  {
    title: "MendForWorks",
    description:
      "Workforce management & booking system — dashboard, multi-user login.",
    href: "https://www.mendforworks.com/",
    imageSrc: "/images/projects/mendforworks.png",
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
              Get More Customers with a Professional Website & Web App
            </h1>
            <p className="text-pretty text-lg text-white/90">
              We help small businesses and startups in the UK grow with
              mobile-friendly websites, booking systems, dashboards, and MVP
              platforms.
            </p>
            <Link
              className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
              href="/#contact"
            >
              Get Your Free Website Review
            </Link>
          </div>

          <div className="w-full max-w-xl">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/hero/hero.jpg"
                alt="Example sites"
                width={900}
                height={600}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">
            Our Services
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
                1. Free Website Review
              </h3>
              <p className="text-sm text-black/70">We assess your site or idea.</p>
            </div>
            <div className="rounded-xl bg-[#f7f7f7] p-8 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#0b3d91]">
                2. Build & Launch
              </h3>
              <p className="text-sm text-black/70">Develop & launch your project.</p>
            </div>
            <div className="rounded-xl bg-[#f7f7f7] p-8 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#0b3d91]">
                3. Grow & Support
              </h3>
              <p className="text-sm text-black/70">Ongoing help & optimisation.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
              href="/#contact"
            >
              Start Your Free Review Today
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0b3d91] py-14 text-center text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Grow Your Business Online?</h2>
          <p className="mt-4 text-lg text-white/90">
            Get a professional website or MVP web app that brings real enquiries
            and customers.
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#ffc107] px-6 py-3 font-bold text-[#0b3d91] transition-colors hover:bg-[#e6b800]"
            href="/#contact"
          >
            Request Free Website Review
          </Link>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#0b3d91]">Contact</h2>
          <p className="mt-4 text-sm text-black/70">
            Email:{" "}
            <a className="text-[#0b3d91] hover:underline" href="mailto:info@splendidtechnology.co.uk">
              info@splendidtechnology.co.uk
            </a>
            {" "} | Phone:{" "}
            <a className="text-[#0b3d91] hover:underline" href="tel:+447721952967">
              +44 7721952967
            </a>
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

