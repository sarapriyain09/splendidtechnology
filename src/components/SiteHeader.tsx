"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NavItem =
  | { href: string; label: string; desc: string; isLabel?: false }
  | { isLabel: true; label: string; href?: never; desc?: never };

const crmItems: NavItem[] = [
  { isLabel: true, label: "CRM" },
  { href: "/services/sales-crm", label: "CRM Overview", desc: "Lead capture, follow-up workflows, and customer pipelines" },
  { href: "/services/call-crm", label: "CallCRM", desc: "Route, track, and manage customer calls in one console" },
  { href: "/services/sales-crm", label: "Lead Workflow Automation", desc: "Automate qualification, routing, and follow-up tasks" },
  { href: "/services/sales-crm", label: "Quote and Customer Flows", desc: "Standardize quoting and customer handoff processes" },
  { href: "/services/software-development#workflow", label: "CRM Workflow Automation", desc: "Digitize approvals, reporting, and customer workflows" },
  { href: "/services/digital-engineering", label: "Sales and Reporting Dashboards", desc: "Pipeline visibility and decision-ready reporting" },
];

const digitisationItems: NavItem[] = [
  { isLabel: true, label: "Digitisation" },
  { href: "/services/software-development", label: "Digitisation Overview", desc: "Connected systems for scalable business operations" },
  { href: "/services/software-development#erp", label: "ERP Modules", desc: "Operational and finance workflow implementation" },
  { href: "/services/software-development#workflow", label: "Workflow Automation", desc: "Digitize approvals, reporting, and process handoffs" },
  { href: "/services/software-development", label: "System Integration", desc: "Connect CRM, ERP, operations, and reporting systems" },
  { href: "/services/digital-engineering", label: "Warehouse and Supply Chain", desc: "Inventory, warehouse, and supply chain visibility" },
  { href: "/services/digital-engineering", label: "Supply Chain Planning", desc: "Supplier flow visibility and procurement coordination" },
  { href: "/services/software-development#cloud", label: "Cloud Architecture", desc: "AWS and Azure architecture for scalable systems" },
];

const saasItems: NavItem[] = [
  { isLabel: true, label: "SaaS" },
  { href: "/services/web-app-development", label: "SaaS Overview", desc: "Build and scale web platforms for SME growth" },
  { href: "/services/web-app-development", label: "Customer Portals", desc: "Secure self-service experiences for clients" },
  { href: "/services/web-app-development", label: "Internal Workflow Apps", desc: "Purpose-built apps for team operations" },
  { href: "/services/web-app-development", label: "API and System Integration", desc: "Integrate core platforms and business tools" },
  { href: "/products", label: "Products and SaaS Tools", desc: "Explore Splendid software products" },
];

const iotItems: NavItem[] = [
  { isLabel: true, label: "IoT" },
  { href: "/services/iot-solutions", label: "IoT Solutions Overview", desc: "Sensors, connectivity, monitoring, and asset telemetry" },
  { href: "/services/iot-solutions#condition-monitoring", label: "Condition Monitoring", desc: "Vibration, temperature, and energy trend analysis" },
  { href: "/industrial-iot/smart-motor-monitoring", label: "Smart Motor Monitoring", desc: "Real-time motor health with alerting workflows" },
  { href: "/industrial-iot/predictive-maintenance", label: "Predictive Maintenance", desc: "Data-driven failure prediction and planning" },
  { href: "/proof-of-concept", label: "Asset Insight Pilot", desc: "Live Raspberry Pi and cloud pilot platform" },
];

const aiItems: NavItem[] = [
  { isLabel: true, label: "AI Solutions" },
  { href: "/services/software-development#workflow", label: "AI Workflow Automation", desc: "Apply AI to repetitive operational tasks" },
  { href: "/services/call-crm", label: "AI-Ready Call Management", desc: "Structured call data for smarter follow-up workflows" },
  { href: "/services/iot-solutions", label: "Data and Telemetry Foundations", desc: "Build the data layer required for reliable AI outcomes" },
  { href: "/industrial-iot/predictive-maintenance", label: "Predictive Insights", desc: "Prediction workflows for operations and maintenance" },
  { href: "/proof-of-concept", label: "AI and Automation Pilot", desc: "Test a high-impact use case before full rollout" },
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
              CRM · Digitisation · SaaS · AI Solutions · IoT · UK Nationwide
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
            <DropdownMenu label="CRM" href="/services/sales-crm" items={crmItems} />
            <DropdownMenu label="Digitisation" href="/services/software-development" items={digitisationItems} />
            <DropdownMenu label="SaaS" href="/services/web-app-development" items={saasItems} />
            <DropdownMenu label="AI Solutions" href="/services/software-development#workflow" items={aiItems} />
            <DropdownMenu label="IoT" href="/services/iot-solutions" items={iotItems} />
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
              <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-green-400/80">CRM</p>
              {crmItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Digitisation</p>
              {digitisationItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">SaaS</p>
              {saasItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">AI Solutions</p>
              {aiItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">IoT</p>
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
