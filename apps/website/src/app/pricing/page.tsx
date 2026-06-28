import type { Metadata } from "next";
import { PricingSwitcher } from "@/components/pricing/PricingSwitcher";

export const metadata: Metadata = {
  title: "Velynxia Pricing | Growth Platform and AI Media Suite",
  description:
    "One pricing page for both Velynxia product families: Growth Platform and AI Media Suite.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="bg-[#f7faff]">
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7dd19a]">VELYNXIA PRICING</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">One Pricing Page. Two Product Families.</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Compare and choose between the Growth Platform and AI Media Suite under one Velynxia brand experience.
          </p>
        </div>
      </section>

      <PricingSwitcher />
    </div>
  );
}
