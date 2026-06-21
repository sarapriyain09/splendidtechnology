import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mechanical Engineering Services UK | CAD, FEA, Prototyping | Velynxia",
  description:
    "Mechanical engineering services for UK industry including CAD design, manufacturing drawings, FEA, reverse engineering, and prototyping support.",
  keywords: [
    "mechanical engineering services uk",
    "cad design services uk",
    "fea analysis services uk",
    "reverse engineering services uk",
    "prototype engineering uk",
    "manufacturing drawing services uk",
  ],
  alternates: {
    canonical: "/services/mechanical-engineering",
  },
};

export default function MechanicalEngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - Mechanical Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Mechanical Engineering and Product Development
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Mechanical design and validation services covering concept development through to
            manufacturing documentation for industrial and engineering clients.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/services/engineering-manufacturing" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              View Mechanical Capability Details
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              Discuss Mechanical Project
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-bold text-[#0b1f3a]">What This Includes</h2>
            <ul className="mt-5 space-y-2">
              {[
                "3D CAD design and assembly modelling",
                "Manufacturing and detail drawings",
                "FEA and simulation-led optimisation",
                "Reverse engineering of legacy parts",
                "Rapid prototyping and DFM support",
                "Supplier-ready documentation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                  <span className="mt-0.5 font-bold text-green-600">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
