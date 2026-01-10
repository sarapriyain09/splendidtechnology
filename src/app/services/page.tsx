import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Web Development Services (UK)",
  description:
    "Custom web development in the UK: web apps, e-commerce builds, automation, and AI integration services from Splendid Technology.",
  keywords: [
    "website development services uk",
    "custom web development uk",
    "web app development uk",
    "ecommerce website development uk",
    "ai integration services uk",
    "business automation services uk",
    "workflow automation uk",
  ],
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    title: "Web Applications",
    bullets: [
      "Custom dashboards & portals",
      "SaaS platforms & internal tools",
      "User authentication & role management",
      "Secure backend APIs",
      "Tech: React, Next.js, FastAPI, Node.js, PostgreSQL",
    ],
  },
  {
    title: "E-Commerce Solutions",
    bullets: [
      "Custom e-commerce websites",
      "Shopify & headless commerce",
      "Payment integration (Stripe, PayPal)",
      "Order, inventory & customer management",
    ],
  },
  {
    title: "Automation, Integrations & AI",
    bullets: [
      "Business process automation (including n8n workflows)",
      "CRM & lead automation",
      "API integrations (payments, email, analytics)",
      "AI integrations: chatbots, copilots, and AI-assisted dashboards",
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
          CodLearn helps with idea generation, learning, and rapid prototyping.
          Splendid Technology delivers custom, scalable, production-ready systems.
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
          <p className="max-w-2xl text-sm leading-6 text-black/70">
            If you need something beyond off-the-shelf products — a custom web app,
            e-commerce build, automation, or AI integration — contact Splendid
            Technology. If you’re still shaping the idea, start with CodLearn and we
            can take it to production.
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
