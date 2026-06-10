"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NavItem =
  | { href: string; label: string; desc: string; isLabel?: false }
  | { isLabel: true; label: string; href?: never; desc?: never };

const iotItems: NavItem[] = [
  { isLabel: true, label: "IoT and Asset Intelligence" },
  { href: "/services/iot-solutions", label: "IoT Solutions Overview", desc: "Sensors, connectivity, monitoring, and asset telemetry" },
  { href: "/services/iot-solutions#condition-monitoring", label: "Condition Monitoring", desc: "Vibration, temperature, and energy trend analysis" },
  { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring", desc: "Real-time motor health with alerting workflows" },
  { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance", desc: "Data-driven failure prediction and planning" },
  { href: "/services/reliability-engineering", label: "Reliability Engineering", desc: "MTBF, FMEA, RAM, and RCM support" },
  { href: "/proof-of-concept", label: "Asset Insight Pilot", desc: "Live Raspberry Pi and cloud pilot platform" },
];

const webAppItems: NavItem[] = [
  { isLabel: true, label: "Web App Development" },
  { href: "/services/web-app-development", label: "Web App Overview", desc: "Custom portals, internal tools, and web products" },
  { href: "/services/web-app-development", label: "Customer Portals", desc: "Secure self-service experiences for clients" },
  { href: "/services/web-app-development", label: "Internal Workflow Apps", desc: "Purpose-built apps for team operations" },
  { href: "/services/web-app-development", label: "SaaS Product Development", desc: "Scalable product architecture and delivery" },
  { href: "/services/web-app-development", label: "API and System Integration", desc: "Integrate core platforms and business tools" },
];

const automationItems: NavItem[] = [
  { isLabel: true, label: "CRM and Sales Systems" },
  { href: "/services/sales-crm", label: "CRM Overview", desc: "Lead capture, follow-up workflows, and customer pipelines" },
  { href: "/services/call-crm", label: "CallCRM", desc: "Route, track, and manage customer calls in one console" },
  { href: "/services/sales-crm", label: "Lead Workflow Automation", desc: "Automate qualification, routing, and follow-up tasks" },
  { href: "/services/sales-crm", label: "Quote and Customer Flows", desc: "Standardize quoting and customer handoff processes" },
  { href: "/services/software-development#workflow", label: "Commercial Workflow Automation", desc: "Digitize approvals, reporting, and commercial tasks" },
  { href: "/services/digital-engineering", label: "Sales and Reporting Dashboards", desc: "Pipeline visibility and decision-ready reporting" },
];

const softwareItems: NavItem[] = [
  { isLabel: true, label: "Operations, ERP and Supply Chain" },
  { href: "/services/software-development#erp", label: "ERP Modules", desc: "Operational and finance workflow implementation" },
  { href: "/services/digital-engineering", label: "Warehouse and Supply Chain", desc: "Inventory, warehouse, and supply chain visibility" },
  { href: "/services/digital-engineering", label: "Supply Chain Planning", desc: "Supplier flow visibility and procurement coordination" },
  { href: "/services/software-development#workflow", label: "Operations Workflow Automation", desc: "Digitize approvals, reporting, and process handoffs" },
  { href: "/services/software-development", label: "System Integration", desc: "Connect CRM, ERP, operations, and reporting systems" },
  { href: "/services/software-development#cloud", label: "Cloud Architecture", desc: "AWS and Azure architecture for scalable operations" },
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
              key={`${item.href}-${item.label}`}
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
              CRM · ERP · Supply Chain · IoT · Web Apps · UK Nationwide
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
            <DropdownMenu label="CRM" href="/services/sales-crm" items={automationItems} />
            <DropdownMenu label="ERP & Supply Chain" href="/services/software-development#erp" items={softwareItems} />
            <DropdownMenu label="IoT" href="/services/iot-solutions" items={iotItems} />
            <DropdownMenu label="Web Apps" href="/services/web-app-development" items={webAppItems} />
            <DropdownMenu label="Products" href="/products" items={products} />
            <Link href="/industries" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Industries
            </Link>
            <Link href="/blog" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Blog
            </Link>
            <Link href="/portfolio" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Portfolio
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
              <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-green-400/80">CRM and Sales Systems</p>
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
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Operations, ERP and Supply Chain</p>
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
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">IoT and Asset Intelligence</p>
              {iotItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Web App Development</p>
              {webAppItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
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
                { href: "/blog", label: "Blog" },
                { href: "/portfolio", label: "Portfolio" },
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
