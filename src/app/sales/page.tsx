import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Velynxia Sales | Customer Growth Platform" },
  description:
    "Convert leads into revenue with sales pipelines, opportunities, quotations, forecasts, and follow-up workflows.",
  alternates: {
    canonical: "/sales",
  },
};

const features = ["Leads", "Opportunities", "Pipelines", "Quotations", "Forecasts", "Follow-ups"];

export default function SalesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Product</p>
      <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">Sales</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">
        Convert qualified leads into revenue with clear pipeline visibility and repeatable sales execution.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
        <Image
          src="/images/projects/sales.png"
          alt="Sales dashboard interface"
          width={1280}
          height={760}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <section className="mt-10 rounded-2xl border border-[#dce8ff] bg-[#f8fbff] p-6">
        <h2 className="text-xl font-bold text-[#13284d]">Core Capabilities</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <li key={item} className="rounded-lg border border-[#e0ebff] bg-white px-3 py-2 text-sm text-[#2a416d]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="rounded-md bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f56dd]">
          Book a Demo
        </Link>
        <Link href="/" className="rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
