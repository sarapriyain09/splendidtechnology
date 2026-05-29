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
  { href: "/products/motor-health-monitoring-kit", label: "Motor Health Monitoring Kit", desc: "Portable motor diagnostic kit" },
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
            <a
              href="https://wa.me/447359631678?text=Hello%20I%20would%20like%20a%20free%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25d366] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1ebe5d]"
              aria-label="Chat on WhatsApp"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.122 1.526 5.855L.057 23.886a.5.5 0 0 0 .614.614l6.088-1.462A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.697-.5-5.25-1.373l-.376-.215-3.894.936.952-3.816-.233-.389A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              <span className="hidden sm:inline">Chat on WhatsApp</span>
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
            <Link href="/pricing" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Pricing
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
                { href: "/pricing", label: "Pricing" },
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
              <div className="space-y-2 pt-4">
                <a
                  href="https://wa.me/447359631678?text=Hello%20I%20would%20like%20a%20free%20consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded bg-[#25d366] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#1ebe5d]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.122 1.526 5.855L.057 23.886a.5.5 0 0 0 .614.614l6.088-1.462A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.697-.5-5.25-1.373l-.376-.215-3.894.936.952-3.816-.233-.389A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
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
