"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  href: string;
  label: string;
  description?: string;
  comingSoon?: boolean;
};

const solutionItems: MenuItem[] = [
  { href: "/services/sales-crm", label: "CRM Solutions", description: "Lead, sales, and customer workflows" },
  { href: "/services/ai-solutions", label: "AI Automation", description: "Email, SMS, and assistant automations" },
  { href: "/services", label: "Business Systems", description: "Portals, internal tools, and reporting systems" },
  { href: "/contact", label: "Integrations", description: "Outlook, Microsoft 365, Twilio, WhatsApp, OpenAI" },
];

const platformItems: MenuItem[] = [
  { href: "/crm", label: "CRM", description: "Contacts, companies, tasks, and customer records" },
  { href: "/sales", label: "Sales", description: "Leads, opportunities, pipelines, and quotations" },
  { href: "/callcrm", label: "CallCRM", description: "Click-to-call, call logging, and follow-up sequences" },
  { href: "/marketing", label: "Marketing", description: "LinkedIn, email, SMS, forms, and campaigns" },
  { href: "/automation", label: "Automation", description: "AI workflows, summaries, and recommendations", comingSoon: true },
  { href: "/analytics", label: "Analytics", description: "Revenue, conversion, and performance insights", comingSoon: true },
];

function DesktopDropdown({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80 hover:text-[#111827]">
        {label}
        <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="invisible absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[#d7e4ff] bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="block rounded-xl px-3 py-2.5 transition hover:bg-[#f5f9ff]"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-[#0f1f3b]">
              {item.label}
              {item.comingSoon ? (
                <span className="rounded-full border border-[#ffd6a8] bg-[#fff3e5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9b5a00]">Soon</span>
              ) : null}
            </p>
            {item.description ? <p className="mt-0.5 text-xs text-[#5e6d8f]">{item.description}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 h-[100px] transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#dbe6ff] bg-white/95 shadow-sm backdrop-blur"
          : "border-b border-transparent bg-white/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/brand/velynxia-Logo.png"
            alt="Velynxia"
            width={1044}
            height={639}
            className="h-auto w-[150px] object-contain sm:w-[170px] lg:w-[190px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            Home
          </Link>
          <DesktopDropdown label="Platform" items={platformItems} />
          <DesktopDropdown label="Solutions" items={solutionItems} />
          <Link href="/industries" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            Industries
          </Link>
          <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            Pricing
          </Link>
          <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            Resources
          </Link>
          <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            About
          </Link>
          <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#223252] transition hover:bg-white/80">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden rounded-full bg-[#e25f24] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c84f1b] lg:inline-flex"
          >
            Book Demo
          </Link>

          <button
            className="rounded-lg p-2 text-[#4f5f82] transition hover:bg-white/80 hover:text-[#111827] lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
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

      {mobileOpen ? (
        <div className="border-t border-[#dbe6ff] bg-white px-4 py-4 shadow-sm lg:hidden">
          <nav className="space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm font-semibold text-[#223252] hover:bg-[#f5f9ff]">
              Home
            </Link>

            <p className="px-2 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#e25f24]">Platform</p>
            {platformItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]"
              >
                {item.label}
                {item.comingSoon ? (
                  <span className="rounded-full border border-[#ffd6a8] bg-[#fff3e5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9b5a00]">Soon</span>
                ) : null}
              </Link>
            ))}

            <p className="px-2 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#e25f24]">Solutions</p>
            {solutionItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]"
              >
                {item.label}
              </Link>
            ))}

            <Link href="/industries" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]">
              Industries
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]">
              Pricing
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]">
              Resources
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm text-[#2d4168] hover:bg-[#f5f9ff]">
              Contact
            </Link>

            <div className="pt-3">
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="block rounded-full bg-[#e25f24] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#c84f1b]"
              >
                Book Demo
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
