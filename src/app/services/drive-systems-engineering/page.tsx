import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drive Systems Engineering Services UK | LV, MV, DC, AFE | Velynxia",
  description:
    "Drive systems engineering services for UK industry including LV and MV AC drives, DC drives, AFE systems, common DC bus architecture, protection coordination, and FAT support.",
  keywords: [
    "drive systems engineering uk",
    "lv mv ac drives uk",
    "dc drive engineering uk",
    "afe rectifier systems uk",
    "common dc bus architecture uk",
    "mv drive engineering services uk",
    "drive protection coordination uk",
    "renewable energy converters uk",
  ],
  alternates: {
    canonical: "/services/drive-systems-engineering",
  },
};

const scope = [
  "LV and MV AC drives (690V to 11kV)",
  "DC drives up to 2250A",
  "Active front end systems and rectifiers",
  "Common DC bus architecture and power flow planning",
  "Drive selection and sizing studies",
  "Protection coordination and fault studies",
  "Integration with control systems",
  "FAT, SAT and commissioning support",
  "Renewable energy converters",
  "Lifecycle support and upgrades",
];

export default function DriveSystemsEngineeringPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - Drive Systems Engineering
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Drive Systems Engineering Services
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            A dedicated specialist capability for industrial clients that need practical LV and MV drive
            system engineering, integration, and commissioning across demanding applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700">
              Discuss Drive Engineering
            </Link>
            <Link href="/services/electrical-engineering" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10">
              Explore Electrical Engineering
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">Service Coverage</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            This is a high-value specialist service where deep engineering capability makes a real
            difference to project delivery risk and long-term reliability.
          </p>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-7">
            <ul className="grid gap-3 sm:grid-cols-2">
              {scope.map((item) => (
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
