import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Engineering Services UK | SLD, I/O, Panel Design | Velynxia",
  description:
    "Electrical engineering services for UK industrial projects including detailed engineering, single line diagrams, I/O lists, panel design, cable schedules, and protection studies.",
  keywords: [
    "electrical engineering services uk",
    "single line diagram services uk",
    "control panel design uk",
    "io list development uk",
    "cable schedule engineering uk",
    "protection studies uk",
    "technical specifications electrical uk",
  ],
  alternates: {
    canonical: "/services/electrical-engineering",
  },
};

const deliverables = [
  "Detailed engineering packages",
  "Single line diagrams and load lists",
  "I/O lists and signal schedules",
  "Control panel layout and design",
  "Cable schedules and termination plans",
  "Protection studies and settings philosophy",
  "Technical specifications and datasheets",
  "Design review and FAT support",
];

export default function ElectricalEngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - Electrical Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Electrical Engineering for Industrial Systems
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            From front-end design to detailed engineering documentation, we support industrial
            automation and power projects with practical electrical design outputs your delivery team can use.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Discuss Electrical Scope
            </Link>
            <Link href="/services/automation-engineering" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              Explore Automation Engineering
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Typical Engineering Deliverables</h2>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-7">
            <ul className="grid gap-3 sm:grid-cols-2">
              {deliverables.map((item) => (
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
