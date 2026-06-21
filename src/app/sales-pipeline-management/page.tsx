import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Pipeline Management for SMEs | Velynxia",
  description:
    "Sales pipeline management for SMEs: define clear stages, improve follow-up consistency, and increase quote-to-order conversion.",
  alternates: {
    canonical: "/sales-pipeline-management",
  },
};

export default function SalesPipelineManagementPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[#0b1f3a]">Sales Pipeline Management</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
        Pipeline management is about disciplined execution, not just software. Define stages,
        assign owners, set follow-up SLAs, and measure how many opportunities move from enquiry
        to quote to closed deal.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          "Clear entry and exit criteria per pipeline stage",
          "Stage aging alerts to prevent stalled opportunities",
          "Manager dashboards for weekly review meetings",
          "Quotation tracking from draft to approval",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/75">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services/sales-crm" className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3d91]">
          Sales Pipeline Services
        </Link>
        <Link href="/contact" className="rounded-lg border border-[#0b1f3a]/30 px-5 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5">
          Talk to a Specialist
        </Link>
      </div>
    </main>
  );
}
