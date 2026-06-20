import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Velynxia Automation | Customer Growth Platform" },
  description:
    "Automation module for workflow builder, AI assistant, meeting summaries, email generation, and follow-up recommendations.",
  alternates: {
    canonical: "/automation",
  },
};

const features = ["Workflow Builder", "AI Assistant", "Meeting Summaries", "Email Generation", "Follow-up Recommendations"];

export default function AutomationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Product</p>
      <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">Automation</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">
        AI-powered workflows and productivity for teams that want to reduce repetitive work and move faster.
      </p>

      <section className="mt-8 rounded-2xl border border-[#ffd6a8] bg-[#fff7ef] p-6">
        <p className="inline-flex rounded-full border border-[#ffd6a8] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#9b5a00]">Coming Soon</p>
        <h2 className="mt-4 text-xl font-bold text-[#713f00]">Planned Capabilities</h2>
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
