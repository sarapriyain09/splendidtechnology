import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Services | Splendid Technology",
  description:
    "Engineering services including digital engineering, reliability workflows, industrial IoT, and applied analysis for UK businesses.",
  alternates: {
    canonical: "/engineering",
  },
};

const focusAreas = [
  {
    title: "Digital Engineering Services",
    body: "Applied engineering support for rotating equipment, operational performance, and practical decision-making workflows.",
    href: "/services/digital-engineering",
  },
  {
    title: "Reliability and Maintenance",
    body: "Condition monitoring and reliability-centered workflows to reduce downtime and improve planning.",
    href: "/services/reliability-engineering",
  },
  {
    title: "Industrial IoT",
    body: "Connected asset telemetry, dashboards, and predictive insight pipelines for operations teams.",
    href: "/services/iot-solutions",
  },
];

export default function EngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Engineering Services for Digital Operations
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We combine engineering domain knowledge with modern software and data systems to improve
            reliability, performance visibility, and operational execution.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Talk to Engineering Team
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Service Areas</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {focusAreas.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/[.02]"
              >
                <h3 className="text-lg font-bold text-[#0b1f3a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
                <span className="mt-4 block text-sm font-semibold text-green-700">Explore service &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
