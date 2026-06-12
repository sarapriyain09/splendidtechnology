import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ERP Solutions | Splendid Technology",
  description:
    "ERP solutions for SMEs including operations workflows, inventory visibility, approval automation, and phased implementation.",
  alternates: {
    canonical: "/erp",
  },
};

const modules = [
  "Operations and work-order tracking",
  "Inventory and warehouse workflows",
  "Procurement and supplier process flows",
  "Approval and handoff automation",
  "ERP reporting and KPI dashboards",
  "CRM and ERP data integration",
];

export default function ErpPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            ERP
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            ERP for Growing Engineering and SME Teams
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Digitize your operational backbone with practical ERP modules that align teams,
            improve visibility, and support scalable growth.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services/software-development#erp"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Explore ERP Services
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Plan ERP Rollout
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Core ERP Scope</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {modules.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-white p-5 text-sm font-semibold text-[#0b1f3a]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
