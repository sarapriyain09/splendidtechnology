import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocations, getLocationBySlug } from "@/lib/locations";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllLocations().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);

  if (!loc) {
    return {
      title: "Location not found",
      alternates: { canonical: `/locations/${slug}` },
    };
  }

  const title = `Web Development in ${loc.name} (UK) — Websites, Web Apps, Automation`;
  const description = `Web development services for ${loc.name} businesses: websites, web apps, ecommerce, and automation. Serving ${loc.name} and nearby areas like ${loc.nearby.join(", ")}.`;

  return {
    title,
    description,
    keywords: [
      `web development ${loc.name}`,
      `website development ${loc.name}`,
      `web app development ${loc.name}`,
      "custom web development uk",
      "web development company uk",
    ],
    alternates: {
      canonical: `/locations/${loc.slug}`,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);

  if (!loc) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Location not found</h1>
        <p className="text-sm text-black/70">
          Try the <Link className="text-blue-700 hover:underline" href="/locations">Locations</Link> index.
        </p>
      </div>
    );
  }

  const isLeicester = loc.slug === "leicester";
  const popularSlugs = [
    "london",
    "birmingham",
    "manchester",
    "leeds",
    "liverpool",
    "bristol",
    "sheffield",
    "nottingham",
    "glasgow",
    "edinburgh",
    "cardiff",
    "belfast",
  ];

  const popularLocations = getAllLocations().filter(
    (l) => popularSlugs.includes(l.slug) && l.slug !== loc.slug
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs text-black/60">UK-wide delivery • Remote-first</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Web development for {loc.name}
        </h1>
        <p className="text-sm leading-6 text-black/70">
          We build fast, maintainable websites, web apps, ecommerce stores, and
          automations for {loc.name} businesses. {isLeicester
            ? "We’re Leicester-based and can also meet locally when needed."
            : "We deliver projects remotely across the UK."}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services">
            Services
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/portfolio">
            Portfolio
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/contact">
            Contact
          </Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/locations">
            All locations
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Areas near {loc.name}</h2>
        <p className="text-sm leading-6 text-black/70">
          We commonly work with teams in {loc.name} and surrounding areas including {loc.nearby.join(", ")}.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we build</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
          <li>Marketing websites that convert (SEO-ready, fast, mobile-first).</li>
          <li>Web apps with accounts, dashboards, and role-based access.</li>
          <li>Ecommerce builds (Shopify or custom) with clean tracking.</li>
          <li>Automation and integrations (CRM, email, payments, reporting).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">A simple delivery approach</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-black/70">
          <li>Short discovery call to confirm goals, scope, and timeline.</li>
          <li>Define pages/screens + integrations and agree v1 deliverables.</li>
          <li>Build in milestones with demos and clear feedback rounds.</li>
          <li>QA, launch checklist, and a clean handover.</li>
        </ol>
      </section>

      {popularLocations.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Popular UK cities</h2>
          <p className="text-sm leading-6 text-black/70">
            Browse other major UK location pages:
          </p>
          <div className="flex flex-wrap gap-3">
            {popularLocations.map((l) => (
              <Link
                key={l.slug}
                className="text-sm font-medium text-blue-700 hover:underline"
                href={`/locations/${l.slug}`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">Get a quote for {loc.name}</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Share your goals, required pages/features, and any examples you like.
          We’ll respond with a realistic scope, timeline, and estimate.
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            href="/contact"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
