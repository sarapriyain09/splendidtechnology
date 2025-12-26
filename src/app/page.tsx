import Link from "next/link";

const services = [
  {
    title: "Web Development",
    description:
      "Modern, fast websites and web apps with a focus on usability and maintainability.",
  },
  {
    title: "Cloud & DevOps",
    description:
      "Deployment pipelines, hosting, monitoring, and reliable operations on cloud platforms.",
  },
  {
    title: "Consulting",
    description:
      "Pragmatic technical guidance to help you ship faster and reduce risk.",
  },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="rounded-2xl border border-black/10 bg-black/[.02] px-6 py-12 sm:px-10">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Splendid Technology
          </h1>
          <p className="text-pretty text-lg text-black/70">
            We help teams build reliable software: from modern websites to cloud
            deployments and ongoing engineering support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-black/90"
              href="/contact"
            >
              Talk to us
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 px-5 text-sm font-medium hover:bg-black/[.03]"
              href="/services"
            >
              View services
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
          <Link className="text-sm font-medium underline underline-offset-4" href="/services">
            All services
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          <p className="text-sm leading-6 text-black/70">
            This site is a starter build. Replace this text with your real
            company story, qualifications, and case studies.
          </p>
          <Link className="text-sm font-medium underline underline-offset-4" href="/about">
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}
