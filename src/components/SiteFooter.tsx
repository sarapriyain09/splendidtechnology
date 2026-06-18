import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dce8ff] bg-[#f8fbff] text-[#0e1629]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Service Menu ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* CRM */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">CRM</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/sales-crm", label: "Splendid CRM" },
                { href: "/services/sales-crm", label: "CRM Implementation" },
                { href: "/services/sales-crm", label: "Sales Pipeline Management" },
                { href: "/services/call-crm", label: "Call CRM" },
                { href: "/services/sales-crm", label: "Quotation Tracking" },
                { href: "/services/sales-crm", label: "Dashboard and Reporting" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-[#586887] hover:text-[#0e1629]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Automation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">AI Automation</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/ai-solutions", label: "AI Assistants" },
                { href: "/services/ai-solutions", label: "Workflow Automation" },
                { href: "/services/ai-solutions", label: "Email and SMS Automation" },
                { href: "/services/ai-solutions", label: "Custom AI Solutions" },
                { href: "/services", label: "CRM Integrations" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-[#586887] hover:text-[#0e1629]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Resources</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/engineering-case-studies", label: "Implementation Stories" },
                { href: "/portfolio", label: "Product Demos" },
                { href: "/about", label: "About Us" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-[#586887] hover:text-[#0e1629]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Book Demo */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1f6dff]">Book Demo</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/demo", label: "Book CRM and AI Demo" },
                { href: "/contact", label: "Talk to a Specialist" },
                { href: "/services/sales-crm", label: "CRM Service Details" },
                { href: "/services/ai-solutions", label: "AI Automation Service Details" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-[#586887] hover:text-[#0e1629]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Company Details ── */}
        <div className="mt-10 border-t border-[#dce8ff] pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            {/* Brand & description */}
            <div className="max-w-xs">
              <Link href="/" className="flex flex-col leading-tight">
                <span className="text-base font-bold text-[#0e1629]">Splendid Technology</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#6c7a99]">CRM and AI Automation Partner for SMEs</span>
              </Link>
              <p className="mt-3 text-xs leading-5 text-[#586887]">
                We help UK SMEs improve sales, operations, and customer delivery through practical
                CRM systems and AI automation workflows.
              </p>
            </div>

            {/* Contact & links */}
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6c7a99]">Contact</p>
                <p className="mt-2 text-xs text-[#586887]">
                  <a className="hover:text-[#0e1629]" href="mailto:info@splendidtechnology.co.uk">info@splendidtechnology.co.uk</a>
                </p>
                <p className="mt-1 text-xs text-[#586887]">
                  <a className="hover:text-[#0e1629]" href="tel:+447723144910">+44 7723 144910</a>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6c7a99]">Company</p>
                <ul className="mt-2 space-y-1">
                  {[
                    { href: "/about", label: "About Us" },
                    { href: "/blog", label: "Insights & Guides" },
                    { href: "/portfolio", label: "Portfolio" },
                    { href: "/services", label: "Services" },
                    { href: "/demo", label: "Book Demo" },
                    { href: "/contact", label: "Contact Us" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-[#586887] hover:text-[#0e1629]">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6c7a99]">Follow</p>
                <div className="mt-2 flex flex-col gap-1">
                  <a href="#" className="text-xs text-[#586887] hover:text-[#0e1629]">LinkedIn</a>
                  <a href="#" className="text-xs text-[#586887] hover:text-[#0e1629]">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Disclaimer */}
        <div className="mt-8 rounded-lg border border-[#dce8ff] bg-white px-5 py-4">
          <p className="text-[11px] leading-5 text-[#6c7a99]">
            <strong className="text-[#3b4d73]">Disclaimer:</strong> Solution recommendations and automation insights are intended to support business decision-making. Final commercial and operational decisions should be reviewed by your internal leadership and delivery teams.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#dce8ff] pt-6 sm:flex-row">
          <p className="text-xs text-[#6c7a99]">
            &copy; {new Date().getFullYear()} Splendid Technology Ltd. Registered in England &amp; Wales. Company No. 17245651
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/privacy-policy" className="text-xs text-[#6c7a99] hover:text-[#0e1629]">Privacy Policy</a>
            <a href="/cookie-policy" className="text-xs text-[#6c7a99] hover:text-[#0e1629]">Cookie Policy</a>
            <a href="https://expapp.co.uk" className="text-xs text-[#6c7a99] hover:text-[#0e1629]" target="_blank" rel="noopener noreferrer">ExpApp</a>
            <span className="text-xs text-[#8a95ad]">Serving UK Nationwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
