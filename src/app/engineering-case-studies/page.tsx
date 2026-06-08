import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Case Studies | Splendid Technology",
  description:
    "Anonymized engineering case studies covering structural dynamics, rotor dynamics, CFD thermal analysis, and reverse engineering for rotating machinery and industrial systems.",
  alternates: {
    canonical: "/engineering-case-studies",
  },
};

const caseStudies = [
  {
    category: "Structural Dynamics",
    title: "Generator Frame Dynamic Analysis",
    challenge:
      "A manufacturer required verification of a generator support structure to ensure operating frequencies would not coincide with structural natural frequencies.",
    scope: [
      "Finite element model development of generator frame",
      "Modal analysis for natural frequencies and mode shapes",
      "Harmonic response analysis",
      "Vibration behaviour evaluation under operating conditions",
    ],
    activities: [
      "Structural modelling",
      "Boundary condition definition",
      "Modal analysis",
      "Harmonic response simulation",
      "Engineering assessment",
    ],
    outcome: [
      "Identified critical vibration modes",
      "Verified structural suitability for operating conditions",
      "Provided recommendations to minimise resonance risk",
    ],
    expertise: [
      "Dynamic FEA",
      "Modal Analysis",
      "Harmonic Response Analysis",
      "Rotating Equipment Engineering",
    ],
  },
  {
    category: "Rotor Dynamics",
    title: "Rotor Dynamic Analysis of High-Speed Machinery",
    challenge:
      "A rotating equipment manufacturer required evaluation of rotor dynamic behaviour for a machine and associated drive train.",
    scope: [
      "Rotor lateral critical speed analysis",
      "Drive train dynamic assessment",
      "Stability evaluation",
      "Operating speed verification",
    ],
    activities: [
      "Rotor modelling",
      "Bearing system representation",
      "Critical speed determination",
      "Campbell diagram generation",
      "Stability assessment",
    ],
    outcome: [
      "Identified critical speed locations",
      "Confirmed operating speed separation margins",
      "Reduced risk of vibration-related operational issues",
    ],
    expertise: [
      "Rotor Dynamics",
      "Rotordynamic Simulation",
      "Critical Speed Analysis",
      "Drive Train Engineering",
    ],
  },
  {
    category: "CFD and Thermal",
    title: "CFD Analysis of Flywheel Energy Storage System",
    challenge:
      "A development team required prediction of thermal behaviour and aerodynamic losses within a flywheel system.",
    scope: [
      "CFD model development",
      "Thermal analysis",
      "Loss prediction",
      "Temperature rise assessment",
    ],
    activities: [
      "Geometry preparation",
      "CFD simulation",
      "Thermal performance evaluation",
      "Loss mechanism assessment",
    ],
    outcome: [
      "Predicted operating temperature profile",
      "Quantified system losses",
      "Supported design optimisation activities",
    ],
    expertise: [
      "CFD Analysis",
      "Thermal Engineering",
      "Energy Storage Systems",
      "Performance Optimisation",
    ],
  },
  {
    category: "Reverse Engineering",
    title: "Reverse Engineering of Legacy Components",
    challenge:
      "A customer required replacement of legacy equipment components where original CAD models and drawings were unavailable.",
    scope: [
      "3D scanning of existing components",
      "CAD reconstruction",
      "Manufacturing drawing generation",
      "Design validation",
    ],
    activities: [
      "Laser/3D scanning",
      "Point cloud processing",
      "Surface reconstruction",
      "CAD model development",
      "Drawing package creation",
    ],
    outcome: [
      "Accurate digital model of legacy component",
      "Manufacturing-ready documentation",
      "Reduced downtime and replacement lead time",
    ],
    expertise: [
      "Reverse Engineering",
      "3D Scanning",
      "CAD Reconstruction",
      "Legacy Equipment Support",
    ],
  },
];

export default function EngineeringCaseStudiesPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Advanced Engineering Analysis
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Engineering Case Studies
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Anonymized case studies that demonstrate specialist expertise in
            structural dynamics, rotor dynamics, CFD and thermal analysis, and
            reverse engineering.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-6 sm:p-8">
                  <span className="inline-block rounded-full bg-[#e8eef9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                    {study.category}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a]">
                    {study.title}
                  </h2>

                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">Challenge</p>
                      <p>{study.challenge}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Scope</p>
                      <ul className="mt-1 space-y-1">
                        {study.scope.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Activities</p>
                      <ul className="mt-1 space-y-1">
                        {study.activities.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0b3d91]">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Outcome</p>
                      <ul className="mt-1 space-y-1">
                        {study.outcome.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#16a34a]">&#10003;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {study.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#d8e2f3] bg-[#f7faff] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Specialist Service Areas</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Structural Dynamics</p>
              <p className="mt-1 text-sm text-slate-700">
                Modal analysis, harmonic response, vibration assessment, and
                resonance evaluation.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Rotor Dynamics</p>
              <p className="mt-1 text-sm text-slate-700">
                Critical speed analysis, lateral rotor behaviour, drive train
                dynamics, and stability assessment.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">CFD and Thermal Analysis</p>
              <p className="mt-1 text-sm text-slate-700">
                Flow analysis, thermal prediction, loss estimation, and
                performance optimisation.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b3d91]">Reverse Engineering</p>
              <p className="mt-1 text-sm text-slate-700">
                3D scanning, CAD reconstruction, legacy component modelling,
                and manufacturing documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Need analysis support for a project?</h2>
          <p className="mt-3 text-slate-300">
            We provide practical, decision-ready engineering analysis for
            rotating equipment and industrial systems.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Discuss a Project
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Solution Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
