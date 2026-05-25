import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Motor Reliability Inspection Kit | Splendid Technology",
  description:
    "Professional portable motor diagnostic solution for UK SMEs and maintenance teams. Book a pilot inspection or request a demo. Prevent costly motor failures with predictive maintenance.",
  keywords: [
    "portable motor diagnostic kit uk",
    "smart motor inspection service uk",
    "motor predictive maintenance uk",
    "motor health assessment uk",
    "industrial motor inspection service leicester",
    "motor condition monitoring sme uk",
    "predictive maintenance pilot uk",
  ],
  alternates: {
    canonical: "/industrial-iot/portable-diagnostic-kit",
  },
};

const serviceOptions = [
  {
    option: "Option 1",
    title: "On-Site Inspection Service",
    tag: "Best Starting Point",
    tagColor: "bg-green-500",
    price: "£1,500",
    unit: "per inspection",
    description:
      "We bring the kit to your site and perform a professional motor health assessment. You get a full diagnostic report with actionable recommendations — no commitment beyond the inspection.",
    bullets: [
      "Per-motor or full-site assessments",
      "Detailed health report included",
      "Same-day results available",
      "No equipment purchase required",
    ],
    cta: "Book an Inspection",
    highlight: false,
  },
  {
    option: "Option 2",
    title: "30-Day Smart Motor Pilot",
    tag: "Most Popular",
    tagColor: "bg-[#0b3d91]",
    price: "£3,000",
    unit: "one-off pilot package",
    description:
      "Temporary installation, live dashboards, analytics, and a full end-of-pilot report. Perfect for SMEs wanting to prove ROI before committing to ongoing monitoring.",
    bullets: [
      "Temporary sensor installation",
      "Live cloud dashboard access",
      "30-day trend analysis",
      "Full pilot report & recommendations",
    ],
    cta: "Request a Pilot",
    highlight: true,
  },
  {
    option: "Option 3",
    title: "Kit Rental",
    tag: "Flexible",
    tagColor: "bg-gray-500",
    price: "£800",
    unit: "per week",
    description:
      "Rent the diagnostic kit for your maintenance team to use independently. Ideal for in-house engineers who want to run regular assessments without purchasing outright.",
    bullets: [
      "Full kit with training included",
      "Dashboard access during rental",
      "Technical support hotline",
      "Purchase credit available",
    ],
    cta: "Enquire About Rental",
    highlight: false,
  },
  {
    option: "Option 4",
    title: "SaaS Monitoring Subscription",
    tag: "Recurring Revenue",
    tagColor: "bg-purple-600",
    price: "£50 – £500",
    unit: "per month — depending on no. of machines & cloud usage",
    description:
      "Ongoing cloud dashboard subscriptions for sites with permanently installed sensors. Scales by number of motors monitored, analytics depth, and cloud storage.",
    bullets: [
      "Monthly health score reports",
      "Predictive alert notifications",
      "Multi-motor & multi-site support",
      "API access & integrations",
    ],
    cta: "Discuss Subscription",
    highlight: false,
  },
];

const pricingTiers = [
  {
    tier: "Starter",
    name: "Motor Inspection Kit",
    price: "£2,500",
    description: "Entry-level professional diagnostic solution for maintenance teams.",
    includes: [
      "Vibration sensor (accelerometer)",
      "Temperature monitoring (RTD/PT100)",
      "Basic current signature analysis",
      "Motor health scoring",
      "Cloud dashboard",
      "Rugged carry case",
    ],
    highlight: false,
  },
  {
    tier: "Professional",
    name: "Predictive Maintenance Kit",
    price: "£6,000",
    description: "Full commercial-grade predictive maintenance system.",
    includes: [
      "FFT vibration analysis",
      "CSA FFT analysis",
      "Differential CT leakage monitoring",
      "Advanced health scoring & trending",
      "Industrial-grade sensors",
      "Full inspection reporting suite",
      "Cloud dashboard + alerts",
      "Rugged IP-rated case",
    ],
    highlight: true,
  },
  {
    tier: "Enterprise",
    name: "Advanced Diagnostic System",
    price: "£15,000+",
    description: "High-value industrial reliability platform for critical assets.",
    includes: [
      "Rogowski coil integration",
      "Advanced FFT & AI diagnostics",
      "Fleet analytics dashboard",
      "Digital twin visualisation",
      "Industrial protocol support (Modbus, OPC-UA)",
      "Wireless sensor options",
      "White-label reporting",
      "On-site commissioning & training",
    ],
    highlight: false,
  },
];

const features = [
  {
    title: "FFT Vibration Analysis",
    description:
      "Identify bearing wear, imbalance, and misalignment through vibration signature analysis — catching faults weeks before breakdown.",
  },
  {
    title: "Current Signature Analysis",
    description:
      "Detect rotor bar faults, air gap eccentricity, and winding issues through motor current patterns — without disconnecting the motor.",
  },
  {
    title: "Temperature Monitoring",
    description:
      "Track winding and bearing temperatures in real time. Flag overheating before it causes insulation damage or failure.",
  },
  {
    title: "Motor Health Scoring",
    description:
      "Every inspection produces a clear health score and condition summary — easy to act on without specialist training.",
  },
  {
    title: "Predictive Maintenance Alerts",
    description:
      "Automated alerts identify which motors need attention and estimate remaining useful life — so maintenance is planned, not reactive.",
  },
  {
    title: "Leakage Current Monitoring",
    description:
      "Differential CT sensors detect early insulation degradation and earth leakage — a leading indicator of motor failure.",
  },
  {
    title: "Cloud Dashboard & Reports",
    description:
      "Results upload to a secure web dashboard. View trends, history, and professional inspection reports from any device.",
  },
  {
    title: "Portable Field Deployment",
    description:
      "Everything fits in a rugged, foam-lined carry case. Designed for maintenance engineers moving between sites — no fixed installation needed.",
  },
];

const steps = [
  {
    step: "1",
    title: "Connect Sensors",
    description:
      "Attach vibration, current, and temperature sensors to the motor. Non-invasive — no rewiring, no shutdown.",
  },
  {
    step: "2",
    title: "Capture Data",
    description:
      "The portable edge kit records real-time readings. Data collection takes minutes per motor, on-site.",
  },
  {
    step: "3",
    title: "Run Diagnostics",
    description:
      "Vibration FFT, current signature analysis, and temperature trending run automatically at the edge.",
  },
  {
    step: "4",
    title: "Receive Health Report",
    description:
      "A clear motor health score and inspection report is generated — with prioritised recommendations your team can act on immediately.",
  },
];

const industries = [
  { sector: "Food Manufacturing", use: "Conveyor motors & production lines" },
  { sector: "HVAC & Utilities", use: "Fans, compressors & air handling units" },
  { sector: "Warehousing & Logistics", use: "Conveyor & sortation systems" },
  { sector: "Packaging", use: "Production & filling line motors" },
  { sector: "Pump Systems", use: "Water & process pump reliability" },
  { sector: "General Manufacturing", use: "Any critical rotating equipment" },
];

const launchPhases = [
  {
    phase: "Phase 1",
    title: "Portable Inspection Service",
    description:
      "We perform on-site motor health assessments using the kit. Low commitment for the customer — immediate, actionable insight.",
    active: true,
  },
  {
    phase: "Phase 2",
    title: "Pilot Programmes",
    description:
      "30-day smart motor monitoring pilots with temporary installation, live dashboards, and a full analytical report.",
    active: false,
  },
  {
    phase: "Phase 3",
    title: "Maintenance Contracts",
    description:
      "Regular scheduled inspections — monthly or quarterly. Ongoing health tracking with year-on-year trend reporting.",
    active: false,
  },
  {
    phase: "Phase 4",
    title: "Permanent Monitoring",
    description:
      "Fixed sensor installations for critical motors with 24/7 live dashboards, SaaS subscriptions, and fleet analytics.",
    active: false,
  },
];

export default function PortableDiagnosticKitPage() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="mb-5 flex gap-2 text-xs text-white/40">
            <Link href="/industrial-iot" className="hover:text-white/70">
              Industrial IoT
            </Link>
            <span>/</span>
            <span className="text-green-400">Smart Motor Reliability Inspection Kit</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-green-400">
                Professional Industrial Diagnostic Solution
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Smart Motor Reliability Inspection Kit
              </h1>
              <p className="mt-4 text-base leading-7 text-white/70">
                A professional-grade portable diagnostic system for maintenance teams and industrial SMEs.
                Prevent costly motor failures, reduce unplanned downtime, and give your team the insight
                to make confident maintenance decisions — on any site, immediately.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-block rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Book a Pilot Assessment →
                </Link>
                <Link
                  href="/contact"
                  className="inline-block rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white hover:bg-white/10"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/industrial-iot/motor-diagonestic-kit.png"
                alt="Smart Motor Diagnostic Kit — portable carry case with dashboard, current transformers, vibration sensor and temperature sensor"
                width={960}
                height={720}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI / Downtime Cost Insight ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-[#0b1f3a]">
                Your Downtime Costs More Than the Kit
              </h2>
              <p className="text-sm leading-7 text-black/70">
                Industrial customers don't compare this system against sensor prices or electronics components.
                They compare it against the cost of unplanned downtime — and that calculation changes everything.
              </p>
              <p className="text-sm leading-7 text-black/70">
                A single motor failure causing 4 hours of lost production, emergency call-out, and repair costs
                can easily exceed{" "}
                <span className="font-bold text-[#0b1f3a]">£50,000</span>.
                A professional inspection that catches that fault early pays for itself on the first use.
              </p>
              <p className="text-sm leading-7 text-black/70">
                We position this as a{" "}
                <span className="font-bold text-[#0b1f3a]">reliability investment</span>, not an electronics purchase.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Predictive Alerts", value: "Very High ROI", color: "text-green-600" },
                { label: "Inspection Reports", value: "Very High ROI", color: "text-green-600" },
                { label: "Downtime Prevention", value: "Very High ROI", color: "text-green-600" },
                { label: "Health Scoring", value: "High ROI", color: "text-[#0b3d91]" },
                { label: "FFT Diagnostics", value: "High ROI", color: "text-[#0b3d91]" },
                { label: "Cloud Dashboard", value: "High ROI", color: "text-[#0b3d91]" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-black/10 bg-gray-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/50">
                    {item.label}
                  </p>
                  <p className={`mt-1 text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Options ── */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0b1f3a]">
              How We Work With You
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-black/60">
              You don't have to buy the kit upfront. We offer four flexible ways to access professional
              motor diagnostics — starting from a single on-site inspection.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceOptions.map((opt) => (
              <div
                key={opt.option}
                className={`flex flex-col rounded-2xl border p-6 ${
                  opt.highlight
                    ? "border-[#0b3d91] bg-[#0b1f3a] text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-black/30 text-white/40">
                    {opt.option}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${opt.tagColor}`}>
                    {opt.tag}
                  </span>
                </div>
                <h3 className={`text-base font-bold ${opt.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {opt.title}
                </h3>
                <div className="mt-3">
                  <p className={`text-xl font-bold ${opt.highlight ? "text-green-400" : "text-[#0b3d91]"}`}>
                    {opt.price}
                  </p>
                  <p className={`text-xs ${opt.highlight ? "text-white/50" : "text-black/40"}`}>
                    {opt.unit}
                  </p>
                </div>
                <p className={`mt-3 flex-1 text-sm leading-6 ${opt.highlight ? "text-white/70" : "text-black/60"}`}>
                  {opt.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {opt.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-2 text-xs ${opt.highlight ? "text-white/70" : "text-black/60"}`}
                    >
                      <span className="mt-0.5 text-green-500">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-5 inline-block rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    opt.highlight
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-[#0b1f3a] text-white hover:bg-[#0b3d91]"
                  }`}
                >
                  {opt.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kit Pricing Tiers ── */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Kit Pricing Tiers</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              If you want to purchase the kit outright — for your maintenance team or service business —
              we offer three tiers depending on the diagnostics depth you need.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.tier}
                className={`flex flex-col rounded-2xl border p-6 ${
                  tier.highlight
                    ? "border-green-400 bg-white"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block self-start rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Recommended
                  </span>
                )}
                <p className={`text-xs font-bold uppercase tracking-wider ${tier.highlight ? "text-[#0b3d91]" : "text-white/40"}`}>
                  {tier.tier}
                </p>
                <h3 className={`mt-1 text-lg font-bold ${tier.highlight ? "text-[#0b1f3a]" : "text-white"}`}>
                  {tier.name}
                </h3>
                <p className={`mt-3 text-2xl font-bold ${tier.highlight ? "text-[#0b3d91]" : "text-green-400"}`}>
                  {tier.price}
                </p>
                <p className={`mt-2 flex-1 text-sm leading-6 ${tier.highlight ? "text-black/60" : "text-white/60"}`}>
                  {tier.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-xs ${tier.highlight ? "text-black/70" : "text-white/60"}`}
                    >
                      <span className="mt-0.5 text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-6 inline-block rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    tier.highlight
                      ? "bg-[#0b1f3a] text-white hover:bg-[#0b3d91]"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  Request a Quote →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/30">
            Not ready to purchase? Start with an inspection service or pilot programme above — no commitment required.
          </p>
        </div>
      </section>

      {/* ── Kit Features ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0b1f3a]">What the Kit Measures</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-black/60">
              Professional diagnostic capabilities that give your maintenance team real intelligence — not just data.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-black/10 bg-gray-50 p-6"
              >
                <h3 className="font-bold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">How an Inspection Works</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-black/10 bg-white p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1f3a] text-sm font-bold text-white">
                  {step.step}
                </div>
                <h3 className="font-bold text-[#0b1f3a]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Industries We Serve</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <div
                key={ind.sector}
                className="flex items-start gap-4 rounded-2xl border border-black/10 bg-gray-50 p-5"
              >
                <span className="mt-0.5 text-green-500">→</span>
                <div>
                  <p className="font-bold text-[#0b1f3a]">{ind.sector}</p>
                  <p className="mt-1 text-sm text-black/60">{ind.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Launch Phases ── */}
      <section className="bg-[#0f2a47] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Our Recommended Launch Path</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              Start with a single inspection. Build trust. Grow into recurring contracts and permanent monitoring.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {launchPhases.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-2xl p-6 ${phase.active ? "bg-green-500" : "bg-white/10"}`}
              >
                <p
                  className={`mb-1 text-xs font-bold uppercase tracking-wider ${
                    phase.active ? "text-white/80" : "text-white/40"
                  }`}
                >
                  {phase.phase}
                </p>
                <h3 className={`font-bold ${phase.active ? "text-white" : "text-white/80"}`}>
                  {phase.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-6 ${phase.active ? "text-white/90" : "text-white/55"}`}
                >
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-[#0b3d91]/20 bg-[#0b1f3a]/5 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">
            Start With a Single Motor Inspection
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
            No commitment. No hardware purchase required. We bring the kit to your site, run a professional
            motor health assessment, and hand you a clear diagnostic report with prioritised recommendations.
            The data will speak for itself.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
            >
              Book a Pilot Assessment →
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-[#0b1f3a] px-6 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Back */}
      <div className="bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link href="/industrial-iot" className="text-sm text-[#0b3d91] hover:underline">
            ← Back to Industrial IoT
          </Link>
        </div>
      </div>

    </div>
  );
}
