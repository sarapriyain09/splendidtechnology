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
      title: "CRM Consultant Leicester | AI Automation and Workflow Systems | Splendid Technology",
      description:
        "Splendid Technology provides CRM consultancy, AI automation, and workflow systems for Leicester SMEs.",
      keywords: [
        "crm consultant leicester",
        "crm implementation leicester",
        "ai automation leicester",
        "workflow automation leicester",
        "crm for smes leicester",
        "automation partner leicestershire",
      ],
    },
    birmingham: {
      title: "CRM Consultant Birmingham | AI Automation and Workflow Systems | Splendid Technology",
      description:
        "CRM consultancy and AI automation services for Birmingham SMEs, including pipeline workflows and integrations.",
      keywords: [
        "crm consultant birmingham",
        "crm implementation birmingham",
        "ai automation birmingham",
        "workflow automation west midlands",
        "crm for smes birmingham",
        "crm integrations birmingham",
      ],
    },
    manchester: {
      title: "CRM Consultant Manchester | AI Automation and Workflow Systems | Splendid Technology",
      description:
        "CRM consultancy and AI automation services for Manchester SMEs, including sales pipeline workflows and integrations.",
      keywords: [
        "crm consultant manchester",
        "crm implementation manchester",
        "ai automation manchester",
        "workflow automation manchester",
        "crm for smes manchester",
        "crm integrations manchester",
      ],
    },
    london: {
      title: "CRM Consultant London | AI Automation and Workflow Systems | Splendid Technology",
      description:
        "Splendid Technology delivers CRM consultancy, AI automation, and workflow systems for London SMEs.",
      keywords: [
        "crm consultant london",
        "crm implementation london",
        "ai automation london",
        "workflow automation london",
        "crm for smes london",
        "twilio crm integration london",
      ],
    },
  };

  const featured = cityMeta[loc.slug];

  const title = featured
    ? featured.title
    : `CRM and AI Automation in ${loc.name} (UK) | Splendid Technology`;

  const description = featured
    ? featured.description
    : `CRM, AI automation, and workflow integration services for ${loc.name} businesses. Serving ${loc.name} and nearby areas like ${loc.nearby.join(", ")}.`;

  const keywords = featured
    ? featured.keywords
    : [
        `crm consultant ${loc.name}`,
        `ai automation ${loc.name}`,
        `workflow automation ${loc.name}`,
        "crm implementation uk",
        "crm automation partner uk",
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
      heading: "CRM and AI automation partner in Leicester",
      para: "Splendid Technology is Leicester-based. We help SMEs across Leicester and Leicestershire improve lead management, follow-up workflows, and business systems execution.",
    },
    birmingham: {
      heading: "CRM and AI automation support for Birmingham",
      para: "We deliver CRM implementation and AI automation for Birmingham SMEs and West Midlands businesses, with practical rollout support.",
    },
    london: {
      heading: "CRM and AI automation support for London",
      para: "We deliver CRM implementation and AI automation for London SMEs with UK-based support and clear implementation phases.",
    },
  };

  const intro = cityIntro[loc.slug] ?? {
    heading: `CRM and AI automation for ${loc.name}`,
    para: `We design practical CRM and workflow automation systems for ${loc.name} businesses. ${isLeicester ? "We are Leicester-based and can also meet locally when needed." : "We deliver projects remotely across the UK."}`,
  };

  const localSchemaByCity: Record<string, { name: string; description: string }> = {
    leicester: {
      name: "CRM and AI Automation Consultant Leicester - Splendid Technology",
      description:
        "CRM consultancy and AI automation services for Leicester SMEs.",
    },
    birmingham: {
      name: "CRM and AI Automation Consultant Birmingham - Splendid Technology",
      description:
        "CRM consultancy and AI automation services for Birmingham SMEs.",
    },
    manchester: {
      name: "CRM and AI Automation Consultant Manchester - Splendid Technology",
      description:
        "CRM consultancy and AI automation services for Manchester SMEs.",
    },
    london: {
      name: "CRM and AI Automation Consultant London - Splendid Technology",
      description:
        "CRM consultancy and AI automation services for London SMEs.",
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
    name: `CRM and AI Automation Services in ${loc.name}`,
    serviceType: ["CRM consultancy", "AI automation", "Workflow automation"],
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
            { label: "CRM Delivery", desc: `Custom CRM setup and migration for ${loc.name} SMEs` },
            { label: "AI Automation", desc: "Workflow automation, assistants, and messaging sequences" },
            { label: "Integrations", desc: "Outlook, Google Workspace, Twilio, WhatsApp, and APIs" },
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
          <li><strong>CRM implementation</strong> — lead capture, pipeline stages, and follow-up workflows aligned to your sales process.</li>
          <li><strong>AI automation</strong> — automate repetitive sales and operations tasks with assistant-led workflows.</li>
          <li><strong>Customer and team portals</strong> — role-based access to documents, tasks, and status updates.</li>
          <li><strong>Reporting dashboards</strong> — operational and commercial visibility in one shared system.</li>
          <li><strong>Messaging and system integrations</strong> — connect email, SMS, calls, and APIs to your CRM workflows.</li>
        </ul>
      </section>

      {isFeaturedCity && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Why choose a focused CRM and automation partner?</h2>
          <p className="text-sm leading-6 text-black/70">
            Many providers offer generic digital services. Splendid Technology focuses on CRM and AI automation implementation for SMEs,
            giving you a clearer roadmap, faster adoption, and stronger execution outcomes.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Transparent implementation scopes with practical milestones.</li>
            <li>CRM and workflow strategy tied to measurable outcomes.</li>
            <li>Integration-first delivery without disruptive system replacement.</li>
            <li>UK-based team with clear communication throughout.</li>
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">A simple delivery approach</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-black/70">
          <li>Discovery call to confirm goals, systems, and bottlenecks.</li>
          <li>Define CRM and automation scope with prioritized phases.</li>
          <li>Implement in milestones with visible progress and feedback loops.</li>
          <li>Train teams and optimize adoption after rollout.</li>
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
        <h2 className="text-lg font-semibold">Book a discovery call for {loc.name}</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Share your goals, current tools, and target outcomes.
          We will respond with recommended next steps and scope.
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            href="/contact"
          >
            Request Discovery Call
          </Link>
        </div>
      </section>
    </div>
  );
}