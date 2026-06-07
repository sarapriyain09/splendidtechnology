import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#0b1f3a] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Service Menu ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Pillar 1 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Industry 4.0 &amp; Smart Manufacturing</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/iot-solutions", label: "Industrial IoT Solutions" },
                { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring" },
                { href: "/services/iot-solutions#condition-monitoring", label: "Condition Monitoring" },
                { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance" },
                { href: "/services/reliability-engineering", label: "Reliability Engineering" },
                { href: "/proof-of-concept", label: "IoT Proof of Concept" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Automation Engineering */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Automation Engineering</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/automation-engineering", label: "Automation Engineering Overview" },
                { href: "/services/automation-engineering", label: "PLC Programming" },
                { href: "/services/automation-engineering", label: "SCADA & HMI Development" },
                { href: "/services/automation-engineering", label: "Control System Design" },
                { href: "/services/automation-engineering", label: "FAT & Commissioning Support" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Drive & Electrical */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Drive &amp; Electrical Engineering</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/drive-systems-engineering", label: "Drive Systems Engineering" },
                { href: "/services/drive-systems-engineering", label: "LV & MV AC Drives" },
                { href: "/services/drive-systems-engineering", label: "DC Drives & AFE Systems" },
                { href: "/services/electrical-engineering", label: "Electrical Engineering" },
                { href: "/services/electrical-engineering", label: "SLD, I/O Lists & Panel Design" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mechanical Engineering */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Mechanical Engineering</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/mechanical-engineering", label: "Mechanical Engineering Overview" },
                { href: "/services/engineering-manufacturing", label: "CAD Design & Drawings" },
                { href: "/services/engineering-manufacturing#fea", label: "FEA & Structural Analysis" },
                { href: "/services/engineering-manufacturing#cfd", label: "CFD Analysis" },
                { href: "/services/engineering-manufacturing#reverse", label: "Reverse Engineering" },
                { href: "/services/engineering-manufacturing#prototyping", label: "Rapid Prototyping" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Digital Engineering */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Digital Engineering</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/services/digital-engineering", label: "Digital Engineering Overview" },
                { href: "/services/sales-crm", label: "CRM Solutions" },
                { href: "/services/software-development#erp", label: "ERP Solutions" },
                { href: "/services/digital-engineering", label: "Warehouse Management Systems" },
                { href: "/services/digital-engineering", label: "Supply Chain Digitalisation" },
                { href: "/services/software-development#workflow", label: "Workflow Automation" },
              ].map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Company Details ── */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            {/* Brand & description */}
            <div className="max-w-xs">
              <Link href="/" className="flex flex-col leading-tight">
                <span className="text-base font-bold text-white">Splendid Technology</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Engineering Technology Partner · UK Nationwide</span>
              </Link>
              <p className="mt-3 text-xs leading-5 text-white/50">
                Automation Engineering, Drive Systems Engineering, Electrical Engineering,
                Mechanical Engineering, and Digital Engineering solutions for UK industry.
              </p>
            </div>

            {/* Contact & links */}
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Contact</p>
                <p className="mt-2 text-xs text-white/50">
                  <a className="hover:text-white" href="mailto:info@splendidtechnology.co.uk">info@splendidtechnology.co.uk</a>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  <a className="hover:text-white" href="tel:+447723144910">+44 7723 144910</a>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company</p>
                <ul className="mt-2 space-y-1">
                  {[
                    { href: "/about", label: "About" },
                    { href: "/blog", label: "Insights & Guides" },
                    { href: "/contact", label: "Contact Us" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-white/60 hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Follow</p>
                <div className="mt-2 flex flex-col gap-1">
                  <a href="#" className="text-xs text-white/50 hover:text-white">LinkedIn</a>
                  <a href="#" className="text-xs text-white/50 hover:text-white">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Disclaimer */}
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-5 py-4">
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
            <span className="text-xs text-white/30">Serving UK Nationwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
