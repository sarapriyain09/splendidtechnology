import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing | Splendid Growth Platform",
  description:
    "Generate and nurture leads with LinkedIn, email, SMS, forms, segmentation, and landing-page workflows.",
  alternates: {
    canonical: "/marketing",
  },
};

const features = ["LinkedIn Campaigns", "Email Campaigns", "SMS Campaigns", "Segmentation", "Forms", "Landing Pages", "Newsletters"];

export default function MarketingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Product</p>
      <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">Marketing</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">
        Generate and nurture demand with campaign tools that connect directly to CRM and sales pipelines.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
        <Image
          src="/images/projects/marketing.png"
          alt="Marketing dashboard interface"
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
