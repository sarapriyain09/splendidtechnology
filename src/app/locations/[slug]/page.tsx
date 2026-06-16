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

  type CityMeta = { title: string; description: string; keywords: string[] };

  const cityMeta: Record<string, CityMeta> = {
    leicester: {
      title: "CRM Consultant Leicester | CRM and Digitalisation Services | Splendid Technology",
      description:
        "Splendid Technology provides CRM consultancy, digitalisation services, and workflow automation for Leicester SMEs and manufacturers.",
      keywords: [
        "crm consultant leicester",
        "crm implementation leicester",
        "digitalisation consultant leicester",
        "workflow automation leicester",
        "crm for manufacturers leicester",
        "digital transformation leicestershire",
      ],
    },
    birmingham: {
      title: "CRM Consultant Birmingham | CRM and Digitalisation Services | Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for Birmingham SMEs and engineering teams, including pipeline workflows and automation.",
      keywords: [
        "crm consultant birmingham",
        "crm implementation birmingham",
        "digitalisation consultant birmingham",
        "workflow automation west midlands",
        "crm for manufacturers birmingham",
        "digital transformation birmingham",
      ],
    },
    manchester: {
      title: "CRM Consultant Manchester | CRM and Digitalisation Services | Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for Manchester SMEs and industrial teams, including sales pipeline workflows and automation.",
      keywords: [
        "crm consultant manchester",
        "crm implementation manchester",
        "digitalisation consultant manchester",
        "workflow automation manchester",
        "crm for engineering companies manchester",
        "digital transformation manchester",
      ],
    },
    london: {
      title: "Web Developer London | Custom Web Apps & SaaS Development | Splendid Technology",
      description:
        "Splendid Technology delivers custom web applications, SaaS platforms, and business websites for London businesses. Affordable UK web developer and software specialist serving London SMEs.",
      keywords: [
        "web developer London",
        "software developer London",
        "SaaS development London",
        "custom web applications London",
        "web development company London",
        "web app development UK",
        "bespoke software London",
        "small business website London",
        "website hosting for SMEs UK",
        "custom software development London",
      ],
    },
  };

  const featured = cityMeta[loc.slug];

  const title = featured
    ? featured.title
    : `Web Development in ${loc.name} (UK) — Websites, Web Apps, Automation`;

  const description = featured
    ? featured.description
    : `Web development services for ${loc.name} businesses: websites, web apps, ecommerce, and automation. Serving ${loc.name} and nearby areas like ${loc.nearby.join(", ")}.`;

  const keywords = featured
    ? featured.keywords
    : [
        `web development ${loc.name}`,
        `website development ${loc.name}`,
        `web app development ${loc.name}`,
        "custom web development uk",
        "web development company uk",
      ];

  return {
    title,
    description,
    keywords,
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
  const isFeaturedCity = ["leicester", "birmingham", "london"].includes(loc.slug);
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

  const cityIntro: Record<string, { heading: string; para: string }> = {
    leicester: {
      heading: "Web developer & software specialist in Leicester",
      para: "Splendid Technology is Leicester-based. We build custom web applications, SaaS platforms, and managed business websites for SMEs across Leicester and Leicestershire — and we can meet locally when needed.",
    },
    birmingham: {
      heading: "Web developer & software specialist serving Birmingham",
      para: "We build custom web applications, SaaS platforms, and business websites for Birmingham SMEs and West Midlands businesses. Delivered remotely with UK-based support and transparent pricing.",
    },
    london: {
      heading: "Web developer & software specialist serving London",
      para: "We build custom web applications, SaaS platforms, and business websites for London businesses — without London agency prices. Delivered remotely with UK-based support and a clear process.",
    },
  };

  const intro = cityIntro[loc.slug] ?? {
    heading: `Web development for ${loc.name}`,
    para: `We build fast, maintainable websites, web apps, ecommerce stores, and automations for ${loc.name} businesses. ${isLeicester ? "We're Leicester-based and can also meet locally when needed." : "We deliver projects remotely across the UK."}`,
  };

  const localSchemaByCity: Record<string, { name: string; description: string }> = {
    leicester: {
      name: "CRM Consultant Leicester - Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for Leicester SMEs and manufacturers.",
    },
    birmingham: {
      name: "CRM Consultant Birmingham - Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for Birmingham SMEs and engineering teams.",
    },
    manchester: {
      name: "CRM Consultant Manchester - Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for Manchester SMEs and industrial teams.",
    },
    london: {
      name: "CRM Consultant London - Splendid Technology",
      description:
        "CRM consultancy and digitalisation services for London SMEs and engineering businesses.",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: localSchemaByCity[loc.slug]?.name ?? `Splendid Technology - ${loc.name}`,
    description:
      localSchemaByCity[loc.slug]?.description ??
      `Digital services for businesses in ${loc.name} and nearby UK areas.`,
    url: `https://www.splendidtechnology.co.uk/locations/${loc.slug}`,
    areaServed: {
      "@type": "City",
      name: loc.name,
    },
    addressCountry: "GB",
    email: "info@splendidtechnology.co.uk",
    telephone: "+44 7723 144910",
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.splendidtechnology.co.uk",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `CRM and Digitalisation Services in ${loc.name}`,
    serviceType: ["CRM consultancy", "Digitalisation", "Workflow automation"],
    areaServed: {
      "@type": "City",
      name: loc.name,
    },
    provider: {
      "@type": "Organization",
      name: "Splendid Technology Ltd",
      url: "https://www.splendidtechnology.co.uk",
    },
    url: `https://www.splendidtechnology.co.uk/locations/${loc.slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <header className="space-y-3">
        <p className="text-xs text-black/60">
          UK-wide delivery &bull; Remote-first{isLeicester ? " \u2022 Leicester office" : ""}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{intro.heading}</h1>
        <p className="text-sm leading-6 text-black/70">{intro.para}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/services">Services</Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/portfolio">Portfolio</Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/contact">Contact</Link>
          <Link className="text-sm font-medium text-blue-700 hover:underline" href="/locations">All locations</Link>
        </div>
      </header>

      {isFeaturedCity && (
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Web Developer", desc: `Custom websites & web apps for ${loc.name} businesses` },
            { label: "Software Developer", desc: "Bespoke software, SaaS & automation platforms" },
            { label: "SME Hosting", desc: "Managed domain, cloud hosting & SSL — fully handled" },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-black/10 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">{card.label}</p>
              <p className="mt-1 text-sm text-black/70">{card.desc}</p>
            </div>
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Areas near {loc.name}</h2>
        <p className="text-sm leading-6 text-black/70">
          We commonly work with teams in {loc.name} and surrounding areas including {loc.nearby.join(", ")}.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we build for {loc.name} businesses</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
          <li><strong>Custom web applications</strong> — portals, dashboards, and SaaS tools with user accounts and role-based access.</li>
          <li><strong>Business websites</strong> — fast, SEO-ready, mobile-first sites with managed hosting and SSL included.</li>
          <li><strong>SaaS development</strong> — multi-tenant platforms with subscription billing, analytics, and API integrations.</li>
          <li><strong>Ecommerce</strong> — Shopify builds or fully custom stores with payment processing and inventory management.</li>
          <li><strong>Automation &amp; integrations</strong> — connect your CRM, email, payments, and reporting tools.</li>
        </ul>
      </section>

      {isFeaturedCity && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Why choose a specialist over a local agency?</h2>
          <p className="text-sm leading-6 text-black/70">
            Many {loc.name} web agencies outsource development or rely on page-builders with hidden limitations.
            Splendid Technology builds everything in-house using modern frameworks (Next.js, React, Node.js)
            — giving you a faster site, cleaner code, and a team that understands what they built.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Transparent fixed-price quotes — no surprise invoices.</li>
            <li>Managed hosting with domain registration and SSL included.</li>
            <li>IoT, reliability engineering, and software products if you ever need them.</li>
            <li>UK-based team with clear communication throughout.</li>
          </ul>
        </section>
      )}

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
          We'll respond with a realistic scope, timeline, and estimate.
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