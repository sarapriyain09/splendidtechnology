import Link from "next/link";

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

const godaddyProducts = [
  {
    title: "Domain Registration",
    description: "Search and register a domain for your business.",
    href: "https://www.thesplendidweb.com/products/domain-registration?plid=596699",
  },
  {
    title: "Domain Transfer",
    description: "Move an existing domain to our GoDaddy storefront.",
    href: "https://www.thesplendidweb.com/products/domain-transfer?plid=596699",
  },
  {
    title: "Website Builder",
    description: "Create a basic website quickly with templates and hosting.",
    href: "https://www.thesplendidweb.com/products/website-builder?plid=596699",
  },
  {
    title: "Managed WordPress",
    description: "WordPress hosting for business sites and blogs.",
    href: "https://www.thesplendidweb.com/products/wordpress?plid=596699",
  },
  {
    title: "cPanel Hosting",
    description: "Traditional hosting with cPanel access.",
    href: "https://www.thesplendidweb.com/products/cpanel?plid=596699",
  },
  {
    title: "SSL Certificates",
    description: "HTTPS for your website and customer trust signals.",
    href: "https://www.thesplendidweb.com/products/ssl?plid=596699",
  },
  {
    title: "Microsoft 365",
    description: "Business email and productivity apps.",
    href: "https://www.thesplendidweb.com/products/microsoft-365?plid=596699",
  },
  {
    title: "JWeller Shopify Theme",
    description:
      "Premium Shopify Online Store 2.0 theme scaffold for jewellery brands.",
    href: "/contact",
    ctaLabel: "Contact us to purchase",
    detailsHref: "/products/jweller-shopify-theme",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
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

      <section id="godaddy-products" className="space-y-5 scroll-mt-24">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="max-w-2xl text-sm leading-6 text-black/70">
            GoDaddy products via our storefront, plus our own deliverables. Use the
            links below to purchase domains, hosting, SSL, and more.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {godaddyProducts.map((product) => (
            <div
              key={product.title}
              className="group rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/[.02]"
            >
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">
                {product.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                {product.href.startsWith("/") ? (
                  <Link className="text-blue-700 hover:underline" href={product.href}>
                    {"ctaLabel" in product ? product.ctaLabel : "Open product page"}
                  </Link>
                ) : (
                  <a
                    className="text-blue-700 hover:underline"
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open product page
                  </a>
                )}

                {"detailsHref" in product && product.detailsHref ? (
                  <Link className="text-blue-700 hover:underline" href={product.detailsHref}>
                    More details
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
