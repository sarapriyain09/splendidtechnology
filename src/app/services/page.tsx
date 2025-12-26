export const metadata = {
  title: "Services | Splendid Technology",
};

const services = [
  {
    title: "Web Development",
    bullets: [
      "Landing pages and marketing sites",
      "Web apps with Next.js",
      "Performance, accessibility, SEO fundamentals",
    ],
  },
  {
    title: "Cloud & DevOps",
    bullets: [
      "Vercel deployments and environments",
      "CI/CD pipelines",
      "Observability and incident readiness",
    ],
  },
  {
    title: "Engineering Consulting",
    bullets: [
      "Architecture reviews",
      "Codebase modernization",
      "Team enablement and delivery support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Replace these service descriptions with your real offerings, pricing
          model, and case studies.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {services.map((service) => (
          <section
            key={service.title}
            className="rounded-2xl border border-black/10 bg-white p-6"
          >
            <h2 className="text-lg font-semibold">{service.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              {service.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
