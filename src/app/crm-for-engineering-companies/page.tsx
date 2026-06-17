import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM for Engineering Companies in the UK | Splendid Technology",
  description:
    "CRM for engineering companies in the UK: improve lead tracking, quotation follow-up, and sales pipeline visibility.",
  alternates: {
    canonical: "/crm-for-engineering-companies",
  },
};

export default function CrmForEngineeringCompaniesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[#0b1f3a]">CRM for Engineering Companies</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
        Engineering businesses often lose opportunities between first enquiry, quote submission,
        and final follow-up. A practical CRM setup gives your team one place to track leads,
        quotations, owners, and next actions.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          "Track every enquiry from first contact to order",
          "Build consistent quote follow-up workflows",
          "Set clear ownership and response SLAs",
          "Use dashboards to improve conversion rates",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/75">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services/sales-crm" className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3d91]">
          Explore CRM Services
        </Link>
        <Link href="/demo" className="rounded-lg border border-[#0b1f3a]/30 px-5 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5">
          Book a CRM Demo
        </Link>
      </div>
    </main>
  );
}
