import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation Engineering Services UK | PLC, SCADA, HMI | Velynxia",
  description:
    "Automation engineering services for UK industry: PLC programming, SCADA and HMI development, control system design, FAT support, commissioning, network architecture, and safety systems.",
  keywords: [
    "automation engineering services uk",
    "plc programming services uk",
    "scada development uk",
    "hmi development uk",
    "control system design uk",
    "fat commissioning support uk",
    "industrial network architecture uk",
    "safety systems integration uk",
  ],
  alternates: {
    canonical: "/services/automation-engineering",
  },
};

const capabilities = [
  {
    title: "PLC Programming",
    items: [
      "PLC software design and modification",
      "Migration of legacy PLC platforms",
      "Sequence logic and interlock design",
      "Diagnostic and fault recovery routines",
    ],
  },
  {
    title: "SCADA and HMI Development",
    items: [
      "Operator interface design",
      "Alarm philosophy and event handling",
      "Process trending and historian integration",
      "Role-based user management",
    ],
  },
  {
    title: "Control System Design",
    items: [
      "Functional design specifications",
      "Cause and effect matrices",
      "Control narratives",
      "I/O allocation and architecture",
    ],
  },
  {
    title: "FAT and Commissioning Support",
    items: [
      "Factory acceptance test planning",
      "Site acceptance support",
      "Loop checks and startup sequencing",
      "Handover documentation",
    ],
  },
  {
    title: "Network and Safety",
    items: [
      "Industrial network architecture",
      "Panel and field integration",
      "Safety system interfacing",
      "Functional safety support",
    ],
  },
];

export default function AutomationEngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - Automation Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            PLC, SCADA and Control System Engineering Services
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            Specialist automation engineering delivery for UK industrial businesses that need reliable
            controls, practical commissioning support, and scalable system architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Discuss Automation Project
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              View All Engineering Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Automation Engineering Scope</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{capability.title}</h3>
                <ul className="mt-4 space-y-2">
                  {capability.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="mt-0.5 font-bold text-green-600">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
