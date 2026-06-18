import Link from "next/link";

const footerGroups = {
  solutions: [
    { href: "/services/sales-crm", label: "CRM Solutions" },
    { href: "/services/ai-solutions", label: "AI Automation" },
    { href: "/services", label: "Business Systems" },
  ],
  products: [{ href: "/demo", label: "DemoCRM" }],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/engineering-case-studies", label: "Case Studies" },
    { href: "/portfolio", label: "Product Demos" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/industries", label: "Industries" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dbe6ff] bg-[#f7faff] text-[#15233f]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Solutions</h3>
            <ul className="mt-4 space-y-2.5">
              {footerGroups.solutions.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-[#4f5f82] transition hover:text-[#0e1629]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Products</h3>
            <ul className="mt-4 space-y-2.5">
              {footerGroups.products.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-[#4f5f82] transition hover:text-[#0e1629]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {footerGroups.resources.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-[#4f5f82] transition hover:text-[#0e1629]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {footerGroups.company.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-[#4f5f82] transition hover:text-[#0e1629]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Contact</h3>
            <div className="mt-4 space-y-2.5 text-sm text-[#4f5f82]">
              <p>
                <a href="mailto:info@splendidtechnology.co.uk" className="transition hover:text-[#0e1629]">
                  info@splendidtechnology.co.uk
                </a>
              </p>
              <p>
                <a href="tel:+447723144910" className="transition hover:text-[#0e1629]">
                  +44 7723 144910
                </a>
              </p>
            </div>

            <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#4d6086]">Social</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#4f5f82]">
              <a href="#" className="transition hover:text-[#0e1629]">LinkedIn</a>
              <a href="#" className="transition hover:text-[#0e1629]">YouTube</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#dbe6ff] pt-6 text-xs text-[#6a7897]">
          <p>Copyright {new Date().getFullYear()} Splendid Technology Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
