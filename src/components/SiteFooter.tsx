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
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Industrial IoT &amp; Business Improvement</span>
            </Link>
            <p className="mt-3 text-xs leading-5 text-white/50">
              A UK engineering technology company (Leicester) delivering smart monitoring,
              predictive maintenance, and AI-powered business process improvement for
              manufacturers and industrial SMEs.
            </p>
            <p className="mt-4 text-xs text-white/50">
              <a className="hover:text-white" href="mailto:info@splendidtechnology.co.uk">
                info@splendidtechnology.co.uk
              </a>
            </p>
            <p className="mt-1 text-xs text-white/50">
              <a className="hover:text-white" href="tel:+447721952967">
                +44 7721 952967
              </a>
            </p>
          </div>

          {/* Industrial IoT Solutions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Industrial IoT</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/industrial-iot", label: "Overview" },
                { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring" },
                { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance" },
                { href: "/industrial-iot/portable-diagnostic-kit", label: "Portable Diagnostic Kit" },
                { href: "/industrial-iot/industry-40-solutions", label: "Industry 4.0 Solutions" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Improvement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Business Improvement</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/services", label: "AI Process Automation" },
                { href: "/blog", label: "Insights & Guides" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Company</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact & Book a Pilot" },
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
            &copy; {new Date().getFullYear()} Splendid Technology Ltd. Registered in England &amp; Wales.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/privacy-policy" className="text-xs text-white/40 hover:text-white">Privacy Policy</a>
            <a href="/cookie-policy" className="text-xs text-white/40 hover:text-white">Cookie Policy</a>
            <span className="text-xs text-white/30">Leicester, UK</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
