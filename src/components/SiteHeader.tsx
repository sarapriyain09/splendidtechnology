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
  { href: "/services/ai-solutions", label: "Workflow Automation", desc: "Automate repetitive handoffs and manual tasks" },
  { href: "/services/ai-solutions", label: "Email and SMS Automation", desc: "Set up follow-up flows and trigger-based messaging" },
  { href: "/services/ai-solutions", label: "Custom AI Solutions", desc: "Design AI workflows for your exact business process" },
  { href: "/services", label: "CRM Integrations", desc: "Connect CRM, forms, calls, messaging, and reporting tools" },
];

const resourcesItems: NavItem[] = [
  { isLabel: true, label: "Resources" },
  { href: "/blog", label: "Blog", desc: "Guides on CRM, automation, and SME growth" },
  { href: "/engineering-case-studies", label: "Implementation Stories", desc: "Proof of outcomes from CRM and automation rollouts" },
  { href: "/portfolio", label: "Product Demos", desc: "See CRM, workflow, and automation product walkthroughs" },
];

function DropdownMenu({ label, href, items }: { label: string; href: string; items: NavItem[] }) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="flex items-center gap-1 rounded-lg px-4 py-2 text-[20px] font-semibold text-[#24395f] hover:bg-[#fff3ea] hover:text-[#111827]"
      >
        {label}
        <svg className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      <div className="invisible absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[#ffd8bf] bg-white py-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {items.map((item, i) =>
          item.isLabel ? (
            <p key={i} className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#e2571a] first:pt-2">
              {item.label}
            </p>
          ) : (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="block px-4 py-2.5 hover:bg-[#fff7f1]"
            >
              <span className="block text-sm font-semibold text-[#0e1629]">{item.label}</span>
              <span className="mt-0.5 block text-xs text-[#5c6b8c]">{item.desc}</span>
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
    <header className="sticky top-0 z-40 border-b border-[#e7e7e7] bg-white/95 text-[#0e1629] backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">

        {/* Single-row header */}
        <div className="flex items-center justify-between py-4 lg:py-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/brand/logo-splendid.png"
              alt="Splendid Technology"
              width={620}
              height={248}
              className="h-auto w-[170px] object-contain sm:w-[210px] lg:w-[270px]"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-x-2 lg:flex">
            <DropdownMenu label="Products" href="/services/sales-crm" items={crmItems} />
            <DropdownMenu label="Solutions" href="/services" items={aiItems} />
            <Link href="/pricing" className="rounded-lg px-4 py-2 text-[20px] font-semibold text-[#24395f] hover:bg-[#fff3ea] hover:text-[#111827]">
              Pricing
            </Link>
            <DropdownMenu label="Resources" href="/blog" items={resourcesItems} />
            <Link href="/contact" className="rounded-lg px-4 py-2 text-[20px] font-semibold text-[#24395f] hover:bg-[#fff3ea] hover:text-[#111827]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="https://democrm.splendidtechnology.co.uk/"
              className="hidden rounded-full border-2 border-[#e2571a] px-7 py-2.5 text-xl font-semibold text-[#e2571a] hover:bg-[#fff3ea] lg:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/demo"
              className="hidden rounded-full bg-[#e2571a] px-7 py-2.5 text-xl font-semibold text-white hover:bg-[#c84e18] lg:inline-flex"
            >
              Try CRM for free
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden rounded p-1.5 text-[#5c6b8c] hover:text-[#0e1629]"
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

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-[#e7e7e7] py-4 lg:hidden">
            <div className="space-y-1">
              <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#e2571a]">Products</p>
              {crmItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-2 py-2 text-base text-[#2d4168] hover:bg-[#fff3ea] hover:text-[#0e1629]"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#e2571a]">Solutions</p>
              {aiItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-2 py-2 text-base text-[#2d4168] hover:bg-[#fff3ea] hover:text-[#0e1629]"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#e2571a]">Pricing</p>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-2 py-2 text-base text-[#2d4168] hover:bg-[#fff3ea] hover:text-[#0e1629]"
              >
                Pricing Plans
              </Link>
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#1f6dff]">Resources</p>
              {resourcesItems.filter((i) => !i.isLabel).map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-2 py-2 text-base text-[#2d4168] hover:bg-[#fff3ea] hover:text-[#0e1629]"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#e2571a]">Contact</p>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-2 py-2 text-base text-[#2d4168] hover:bg-[#fff3ea] hover:text-[#0e1629]"
              >
                Contact
              </Link>
              <div className="pt-4">
                <Link
                  href="https://democrm.splendidtechnology.co.uk/"
                  onClick={() => setMobileOpen(false)}
                  className="mb-2 block rounded-xl border-2 border-[#e2571a] px-4 py-2.5 text-center text-base font-bold text-[#e2571a] hover:bg-[#fff3ea]"
                >
                  Log in
                </Link>
                <Link
                  href="/demo"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-[#e2571a] px-4 py-2.5 text-center text-base font-bold text-white hover:bg-[#c84e18]"
                >
                  Try CRM for free
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
