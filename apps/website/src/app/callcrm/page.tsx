import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Velynxia CallCRM | Customer Growth Platform" },
  description:
    "Engage customers and power outbound sales with click-to-call, campaign lists, call logging, and follow-up sequences.",
  alternates: {
    canonical: "/callcrm",
  },
};

const features = ["Click-to-call", "Call Campaigns", "Call Logging", "Recordings", "Agent Dashboards", "Follow-up Sequences"];

export default function CallCrmPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Product</p>
      <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">CallCRM</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">
        Run high-velocity outbound and inbound engagement while keeping every call outcome linked to customer records.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
        <Image
          src="/images/projects/Vel-CallCRM.png"
          alt="CallCRM console interface"
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
