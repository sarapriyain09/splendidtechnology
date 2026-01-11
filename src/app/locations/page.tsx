import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocations } from "@/lib/locations";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Locations (UK) — Web Development by City",
  description:
    "UK-wide web development, ecommerce, automation, and AI integration services. Browse major UK cities we serve.",
  alternates: {
    canonical: "/locations",
  },
};

export default function LocationsPage() {
  const locations = getAllLocations();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
        <p className="max-w-3xl text-sm leading-6 text-black/70">
          We work with UK businesses remotely (and locally in Leicester). Choose your
          city to see a short overview and the fastest way to scope a website, web
          app, ecommerce build, or automation.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <article
            key={loc.slug}
            className="rounded-2xl border border-black/10 bg-white p-6"
          >
            <h2 className="text-lg font-semibold">
              <Link className="hover:underline" href={`/locations/${loc.slug}`}>
                {loc.name}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Serving {loc.name} and nearby areas like {loc.nearby.slice(0, 2).join(" and ")}.
            </p>
            <div className="mt-4">
              <Link
                className="text-sm font-medium text-blue-700 hover:underline"
                href={`/locations/${loc.slug}`}
              >
                View location page
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">Not sure where to start?</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Share your goals, timeline, and any examples you like. We’ll respond with a
          realistic scope and estimate.
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
