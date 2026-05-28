import Image from "next/image";
import Link from "next/link";

const iotLinks = [
  { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring" },
  { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance" },
  { href: "/industrial-iot/portable-diagnostic-kit", label: "Portable Diagnostic Kit" },
  { href: "/industrial-iot/industry-40-solutions", label: "Industry 4.0" },
  { href: "/industrial-iot/reliability-study", label: "Reliability Study" },
  // covers motors, pumps, fans, compressors, HVAC and any rotating system
];

export function SiteHeader() {
  return (
    <header className="bg-[#0b1f3a] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/industrial-iot/logo_Splendid PNG.png"
              alt="Splendid Technology"
              width={360}
              height={144}
              className="h-36 w-auto object-contain"
              priority
            />
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/50 hidden sm:block">
              Industrial IoT &amp; Process Automation
            </span>
          </Link>
          <a
            href="mailto:info@splendidtechnology.co.uk"
            className="hidden text-xs text-white/60 hover:text-white sm:block"
          >
            info@splendidtechnology.co.uk
          </a>
        </div>

        {/* Main nav */}
        <nav className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 py-2">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <Link
              href="/industrial-iot"
              className="rounded bg-green-700/30 px-2 py-1 text-xs font-bold uppercase tracking-wide text-green-400 hover:bg-green-700/50"
            >
              Industrial IoT
            </Link>
            {iotLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-1 text-xs text-white/70 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <Link href="/services" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              AI Automation
            </Link>
            <Link
              href="/tools/mtbf"
              className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-400 hover:border-amber-400/70"
            >
              MTBF Tool <span className="ml-1 text-[9px] font-bold uppercase tracking-wide opacity-70">Soon</span>
            </Link>
            <Link
              href="/proof-of-concept"
              className="rounded border border-amber-400/30 px-2 py-1 text-xs font-semibold text-amber-400 hover:border-amber-400/60"
            >
              Innovation Lab
            </Link>
            <Link href="/blog" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Blog
            </Link>
            <Link href="/about" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              About
            </Link>
            <Link
              href="/contact"
              className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
