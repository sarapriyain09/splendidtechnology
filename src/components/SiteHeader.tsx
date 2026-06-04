"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NavItem =
  | { href: string; label: string; desc: string; isLabel?: false }
  | { isLabel: true; label: string; href?: never; desc?: never };

const iotItems: NavItem[] = [
  { isLabel: true, label: "Industry 4.0 & Smart Manufacturing" },
  { href: "/services/iot-solutions", label: "Industrial IoT Solutions", desc: "IoT sensors, connectivity & industrial monitoring" },
  { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring", desc: "Real-time motor health & predictive alerts" },
  { href: "/services/iot-solutions#condition-monitoring", label: "Condition Monitoring", desc: "Vibration, temperature & energy analysis" },
  { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance", desc: "AI-driven failure prediction & maintenance scheduling" },
  { href: "/services/reliability-engineering", label: "Reliability Engineering", desc: "MTBF, FMEA, RAM & RCM studies" },
  { href: "/proof-of-concept", label: "IoT Proof of Concept", desc: "Live Raspberry Pi + AWS demo platform" },
];

const engineeringItems: NavItem[] = [
  { isLabel: true, label: "Engineering & Product Development" },
  { href: "/services/engineering-manufacturing", label: "CAD Design & Drawings", desc: "3D product design, assemblies & manufacturing drawings" },
  { href: "/services/engineering-manufacturing#fea", label: "FEA & Structural Analysis", desc: "Finite element analysis & simulation" },
  { href: "/services/engineering-manufacturing#cfd", label: "CFD Analysis", desc: "Computational fluid dynamics" },
  { href: "/services/engineering-manufacturing#reverse", label: "Reverse Engineering", desc: "Legacy component recreation & modification" },
  { href: "/services/engineering-manufacturing#prototyping", label: "Rapid Prototyping", desc: "Prototype design, validation & DFM" },
];

const automationItems: NavItem[] = [
  { isLabel: true, label: "Digital Transformation & Automation" },
  { href: "/services/software-development#automation", label: "Process Automation", desc: "Automate repetitive tasks & workflows" },
  { href: "/services/software-development#digitalisation", label: "Business Process Digitalisation", desc: "Replace paper & manual processes with digital systems" },
  { href: "/services/software-development#workflow", label: "Workflow Automation", desc: "End-to-end workflow design & automation" },
  { href: "/services/software-development#analytics", label: "Data Analytics & Dashboards", desc: "Real-time insights & KPI dashboards" },
  { href: "/services/software-development#integration", label: "System Integration", desc: "Connect ERP, CRM & IoT platforms" },
];

const softwareItems: NavItem[] = [
  { isLabel: true, label: "Software Solutions" },
  { href: "/services/sales-crm", label: "CRM Systems", desc: "Custom Sales CRM for UK businesses" },
  { href: "/services/software-development", label: "Custom Software Development", desc: "Bespoke business & enterprise software" },
  { href: "/services/web-app-development", label: "Web Applications", desc: "SaaS apps, portals & APIs" },
  { href: "/services/web-app-development#mobile", label: "Mobile Applications", desc: "iOS & Android app development" },
  { href: "/services/software-development#cloud", label: "Cloud Solutions", desc: "AWS, Azure & cloud architecture" },
];

const products = [
  { href: "/products/expapp-money-planner", label: "ExpApp — Money Planner", desc: "Free household budget & net worth tracker" },
  { href: "/products/splendid-accounting", label: "Splendid Accounting", desc: "SME accounting & finance software" },
  { href: "/products/splendid-reliability", label: "Splendid Reliability", desc: "MTBF calculations & reliability tracking" },
  { href: "/products/splendid-monitor", label: "Splendid Monitor", desc: "Industrial IoT dashboards" },
  { href: "/products/splendid-erp-light", label: "Splendid ERP Light", desc: "Simple ERP for UK SMEs" },
  { href: "/products/splendid-asset-manager", label: "Splendid Asset Manager", desc: "Asset performance & engineering ERP" },
  { href: "/products/motor-health-monitoring-kit", label: "Motor Health Monitoring Kit", desc: "Portable motor diagnostic kit" },
  { href: "/services/sales-crm", label: "Splendid CRM", desc: "Custom Sales CRM for UK businesses" },
];

function DropdownMenu({ label, href, items }: { label: string; href: string; items: NavItem[] }) {
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
        {items.map((item, i) =>
          item.isLabel ? (
            <p key={i} className="px-4 pb-1 pt-3 text-[9px] font-bold uppercase tracking-widest text-green-400/80 first:pt-2">
              {item.label}
            </p>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 hover:bg-white/5"
            >
              <span className="block text-xs font-semibold text-white">{item.label}</span>
              <span className="mt-0.5 block text-[10px] text-white/50">{item.desc}</span>
            </Link>
          )
        )}
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
              Industry 4.0 · Engineering · Automation · Software
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
            <DropdownMenu label="Industry 4.0" href="/services/iot-solutions" items={iotItems} />
            <DropdownMenu label="Engineering" href="/services/engineering-manufacturing" items={engineeringItems} />
            <DropdownMenu label="Automation" href="/services/software-development" items={automationItems} />
            <DropdownMenu label="Software" href="/services/software-development" items={softwareItems} />
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
              <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Industry 4.0 & Smart Manufacturing</p>
              {iotItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Engineering & Product Development</p>
              {engineeringItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Digital Transformation & Automation</p>
              {automationItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Software Solutions</p>
              {softwareItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
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
