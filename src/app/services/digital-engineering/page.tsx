import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Engineering Services UK | CRM, ERP, WMS",
  description:
    "Business systems services for UK businesses including CRM, ERP, warehouse management systems, operations workflows, and workflow automation.",
  keywords: [
    "digital engineering services uk",
    "crm solutions uk",
    "erp solutions uk",
    "warehouse management systems uk",
    "operations workflow systems uk",
    "workflow automation uk",
    "business systems implementation uk",
  ],
  alternates: {
    canonical: "/services/digital-engineering",
  },
};

const services = [
  {
    title: "CRM Solutions",
    body: "Lead capture, pipeline tracking, account management, customer workflows, and reporting designed around your sales and service process.",
  },
  {
    title: "ERP Solutions",
    body: "Core operational modules for purchasing, inventory, job costing, and finance workflows aligned to engineering and manufacturing teams.",
  },
  {
    title: "Warehouse Management Systems",
    body: "Stock visibility, bin control, pick-pack workflows, and dispatch controls that reduce manual handling errors.",
  },
  {
    title: "Operations Workflow Systems",
    body: "Streamline order, supplier, and logistics workflows with practical dashboards, alerts, and process traceability.",
  },
];

export default function DigitalEngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - Digital Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Digital Engineering: CRM, ERP and Operations Platforms
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We help industrial and SME teams move from disconnected spreadsheets and manual processes
            to practical digital systems that improve speed, visibility, and decision quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/services/sales-crm" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Explore CRM Solutions
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              Discuss Business Systems Project
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Digital Engineering Service Areas</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
