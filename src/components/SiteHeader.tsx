"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NavItem =
  | { href: string; label: string; desc: string; isLabel?: false }
  | { isLabel: true; label: string; href?: never; desc?: never };

const crmItems: NavItem[] = [
  { isLabel: true, label: "CRM" },
  { href: "/services/sales-crm", label: "Splendid CRM", desc: "Lead and pipeline workflows with customer visibility" },
  { href: "/services/sales-crm", label: "CRM Implementation", desc: "Setup, migration, adoption, and rollout support" },
  { href: "/services/sales-crm", label: "Sales Pipeline Management", desc: "Stage design, follow-up SLAs, and reporting discipline" },
  { href: "/services/call-crm", label: "Call CRM", desc: "Route, track, and manage calls in one workflow" },
  { href: "/services/sales-crm", label: "Quotation Tracking", desc: "Track quote status from enquiry to order" },
];

const aiItems: NavItem[] = [
  { isLabel: true, label: "AI Automation" },
  { href: "/services/ai-solutions", label: "AI Assistants", desc: "Deploy assistants for support and internal workflows" },
  { href: "/services/software-development#workflow", label: "Workflow Automation", desc: "Automate repetitive handoffs and manual tasks" },
  { href: "/services/ai-solutions", label: "Email and SMS Automation", desc: "Set up follow-up flows and trigger-based messaging" },
  { href: "/services/ai-solutions", label: "Custom AI Solutions", desc: "Design AI workflows for your exact business process" },
  { href: "/services/ai-solutions", label: "CRM Integrations", desc: "Connect CRM, forms, calls, and reporting tools" },
];

const customSoftwareItems: NavItem[] = [
  { isLabel: true, label: "Custom Software" },
  { href: "/services/web-app-development", label: "Web Applications", desc: "Build internal and customer-facing web applications" },
  { href: "/services/web-app-development", label: "SaaS Development", desc: "Launch scalable SaaS products with phased delivery" },
  { href: "/services/web-app-development", label: "Customer Portals", desc: "Secure self-service portals for clients and teams" },
];

const resourcesItems: NavItem[] = [
  { isLabel: true, label: "Resources" },
  { href: "/blog", label: "Blog", desc: "Guides on CRM, automation, and SME growth" },
  { href: "/engineering-case-studies", label: "Case Studies", desc: "Proof of outcomes from delivery projects" },
  { href: "/portfolio", label: "Videos and Portfolio", desc: "See product demos and delivery highlights" },
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
              CRM and AI Automation Solutions for UK SMEs
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
            <DropdownMenu label="AI Automation" href="/services/ai-solutions" items={aiItems} />
            <DropdownMenu label="Custom Software" href="/services/web-app-development" items={customSoftwareItems} />
            <DropdownMenu label="Resources" href="/blog" items={resourcesItems} />
            <Link href="/about" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              About Us
            </Link>
            <Link href="/about/rajagopalan-saravanan" className="px-2 py-1 text-xs text-white/70 hover:text-white">
              Founder
            </Link>
          </div>
          <div className="flex items-center gap-x-2">
            <Link
              href="/demo"
              className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
            >
              Book Demo
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
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">AI Automation</p>
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
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Custom Software</p>
              {customSoftwareItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-green-400/80">Resources</p>
              {resourcesItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Company</p>
              {[
                { href: "/about", label: "About Us" },
                { href: "/about/rajagopalan-saravanan", label: "Founder" },
                { href: "/contact", label: "Contact" },
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
                  href="/demo"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded bg-green-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-green-700"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
