import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#0b1f3a] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-base font-bold text-white">Splendid Technology</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Industry 4.0 &amp; Smart Manufacturing</span>
            </Link>
            <p className="mt-3 text-xs leading-5 text-white/50">
              CAD design, FEA analysis, CFD simulation, reverse engineering, and rapid prototyping
              for UK engineering and manufacturing businesses. Positioned as your engineering
              technology partner.
            </p>
            <p className="mt-3 text-xs text-white/40">
              36 Glazebrook Road, Leicester, LE3 9NT
            </p>
            <p className="mt-2 text-xs text-white/50">
              <a className="hover:text-white" href="mailto:info@splendidtechnology.co.uk">
                info@splendidtechnology.co.uk
              </a>
            </p>
            <p className="mt-1 text-xs text-white/50">
              <a className="hover:text-white" href="tel:+447723144910">
                +44 7723 144910
              </a>
            </p>
          </div>

          {/* Industry 4.0 & Smart Manufacturing */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Industry 4.0 &amp; Smart Manufacturing</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/services/iot-solutions", label: "Industrial IoT Solutions" },
                { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring" },
                { href: "/services/iot-solutions#condition-monitoring", label: "Condition Monitoring" },
                { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance" },
                { href: "/services/reliability-engineering", label: "Reliability Engineering" },
                { href: "/proof-of-concept", label: "IoT Proof of Concept" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engineering & Product Development */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Engineering &amp; Product Development</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/services/engineering-manufacturing", label: "CAD Design & Drawings" },
                { href: "/services/engineering-manufacturing#fea", label: "FEA & Structural Analysis" },
                { href: "/services/engineering-manufacturing#cfd", label: "CFD Analysis" },
                { href: "/services/engineering-manufacturing#reverse", label: "Reverse Engineering" },
                { href: "/services/engineering-manufacturing#prototyping", label: "Rapid Prototyping" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Digital Transformation & Automation + Software Solutions + Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Digital Transformation &amp; Automation</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/services/software-development#automation", label: "Process Automation" },
                { href: "/services/software-development#digitalisation", label: "Business Process Digitalisation" },
                { href: "/services/software-development#workflow", label: "Workflow Automation" },
                { href: "/services/software-development#analytics", label: "Data Analytics & Dashboards" },
                { href: "/services/software-development#integration", label: "System Integration" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-green-400">Software Solutions</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/services/sales-crm", label: "CRM Systems" },
                { href: "/services/software-development", label: "Custom Software Development" },
                { href: "/services/web-app-development", label: "Web Applications" },
                { href: "/services/web-app-development#mobile", label: "Mobile Applications" },
                { href: "/services/software-development#cloud", label: "Cloud Solutions" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-white/40">Company</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/blog", label: "Insights & Guides" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#" className="text-xs text-white/50 hover:text-white">LinkedIn</a>
              <a href="#" className="text-xs text-white/50 hover:text-white">Facebook</a>
            </div>
          </div>
        </div>

        {/* Monitoring Disclaimer */}
        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-[11px] leading-5 text-white/40">
            <strong className="text-white/50">Disclaimer:</strong> Monitoring insights and predictive maintenance recommendations provided by Splendid Technology Ltd are intended to support maintenance decision-making and should not replace standard engineering inspections, operational procedures, or established safety practices.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Splendid Technology Ltd. Registered in England &amp; Wales. Company No. 17245651
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/privacy-policy" className="text-xs text-white/40 hover:text-white">Privacy Policy</a>
            <a href="/cookie-policy" className="text-xs text-white/40 hover:text-white">Cookie Policy</a>
            <a href="https://expapp.co.uk" className="text-xs text-white/40 hover:text-white" target="_blank" rel="noopener noreferrer">ExpApp</a>
            <span className="text-xs text-white/30">Leicester, UK</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
