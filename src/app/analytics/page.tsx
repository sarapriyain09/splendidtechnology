import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Velynxia Analytics | Customer Growth Platform" },
  description:
    "Analytics module for sales analytics, campaign analytics, call analytics, revenue forecasting, and conversion metrics.",
  alternates: {
    canonical: "/analytics",
  },
};

const features = ["Sales Analytics", "Campaign Analytics", "Call Analytics", "Revenue Forecasting", "Conversion Metrics"];

export default function AnalyticsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Product</p>
      <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">Analytics</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">
        Measure and improve performance with clear dashboards for revenue, conversion, campaign outcomes, and calls.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
        <Image
          src="/images/projects/Vel-Analytics.png"
          alt="Analytics dashboard interface"
          width={1280}
          height={760}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <section className="mt-8 rounded-2xl border border-[#ffd6a8] bg-[#fff7ef] p-6">
        <h2 className="text-xl font-bold text-[#713f00]">Planned Capabilities</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {features.map((item) => (
            <li key={item} className="rounded-lg border border-[#ffe0ba] bg-white px-3 py-2 text-sm text-[#6e4a1c]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="rounded-md bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f56dd]">
          Join Demo List
        </Link>
        <Link href="/" className="rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
