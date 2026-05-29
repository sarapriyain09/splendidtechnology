"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const services = [
  { href: "/services/web-app-development", label: "Web & App Development", desc: "Websites, SaaS apps, portals & APIs" },
  { href: "/services/iot-solutions", label: "IoT & Condition Monitoring", desc: "Motor health, vibration & energy monitoring" },
  { href: "/proof-of-concept", label: "IoT Proof of Concept", desc: "Live Raspberry Pi + AWS demo platform" },
  { href: "/services/reliability-engineering", label: "Reliability Engineering", desc: "MTBF, FMEA, RAM & RCM studies" },
  { href: "/services/software-development", label: "Software Development", desc: "Custom business & enterprise software" },
];

const products = [
  { href: "/products/splendid-accounting", label: "Splendid Accounting", desc: "SME accounting & finance software" },
  { href: "/products/splendid-reliability", label: "Splendid Reliability", desc: "MTBF calculations & reliability tracking" },
  { href: "/products/splendid-monitor", label: "Splendid Monitor", desc: "Industrial IoT dashboards" },
  { href: "/products/splendid-asset-manager", label: "Splendid Asset Manager", desc: "Asset performance & engineering ERP" },
];

function DropdownMenu({ label, href, items }: { label: string; href: string; items: { href: string; label: string; desc: string }[] }) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white/80 hover:text-white"
      >
        {label}
        <svg className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      <div className="invisible absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-white/10 bg-[#0b1f3a] py-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 hover:bg-white/5"
          >
            <span className="block text-xs font-semibold text-white">{item.label}</span>
            <span className="mt-0.5 block text-[10px] text-white/50">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-white/50 sm:block">
              Web Apps · IoT · Reliability · Software
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="mailto:info@splendidtechnology.co.uk"
              className="hidden text-xs text-white/60 hover:text-white sm:block"
            >
              info@splendidtechnology.co.uk
            </a>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden rounded p-1.5 text-white/70 hover:text-white"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center justify-between gap-x-1 py-2 lg:flex">
          <div className="flex items-center gap-x-1">
            <DropdownMenu label="Services" href="/services" items={services} />
            <DropdownMenu label="Products" href="/products" items={products} />
            <Link href="/industries" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Industries
            </Link>
            <Link href="/portfolio" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Portfolio
            </Link>
            <Link href="/blog" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Blog
            </Link>
            <Link href="/about" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              About
            </Link>
          </div>
          <div className="flex items-center gap-x-2">
            <Link
              href="/tools/mtbf"
              className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-400 hover:border-amber-400/70"
            >
              MTBF Tool <span className="ml-1 text-[9px] font-bold uppercase tracking-wide opacity-70">Soon</span>
            </Link>
            <Link
              href="/contact"
              className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-white/10 py-4 lg:hidden">
            <div className="space-y-1">
              <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Services</p>
              {services.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Products</p>
              {products.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/30">More</p>
              {[
                { href: "/industries", label: "Industries" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/tools/mtbf", label: "MTBF Tool" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded bg-green-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-green-700"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
