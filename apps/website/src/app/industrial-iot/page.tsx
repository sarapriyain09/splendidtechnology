import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial IoT & Predictive Maintenance | Velynxia UK",
  description:
    "Velynxia delivers smart motor monitoring, predictive maintenance, Industry 4.0 solutions, and AI business process automation for UK manufacturers and industrial SMEs. Reduce downtime. Increase visibility.",
  keywords: [
    "industrial iot uk",
    "smart motor monitoring uk",
    "predictive maintenance uk",
    "industry 4.0 solutions uk",
    "iot monitoring for manufacturers",
    "smart factory solutions uk sme",
    "motor condition monitoring leicester",
  ],
  alternates: {
    canonical: "/industrial-iot",
  },
};

const industries = [
  { icon: "🏭", title: "Manufacturing",     subtitle: "Improve uptime & efficiency" },
  { icon: "🍔", title: "Food & Beverages",  subtitle: "Ensure reliability & safety" },
  { icon: "📦", title: "Warehousing",       subtitle: "Monitor assets in real-time" },
  { icon: "🌡️", title: "HVAC & Utilities", subtitle: "Prevent failures & save energy" },
  { icon: "💧", title: "Pumps & Water",     subtitle: "Ensure continuous operation" },
];

const benefits = [
  { icon: "⏱️", title: "Reduce Downtime",          subtitle: "Avoid unexpected breakdowns" },
  { icon: "💰", title: "Lower Maintenance Cost",    subtitle: "Move from reactive to predictive" },
  { icon: "📊", title: "Real-time Visibility",      subtitle: "See what matters, anytime, anywhere" },
  { icon: "⚙️", title: "Increase Asset Life",       subtitle: "Optimise performance and lifespan" },
  { icon: "🧠", title: "Data-driven Decisions",     subtitle: "Turn data into actionable insights" },
];

const services = [
  {
    title: "Smart Motor Monitoring",
    description:
      "Real-time visibility into the health and performance of your motors — before they fail. Stop reactive repairs and start preventing downtime.",
    href: "/industrial-iot/smart-motor-monitoring",
  },
  {
    title: "Predictive Maintenance",
    description:
      "Know when equipment needs attention before it breaks. Predictive maintenance replaces costly emergency callouts with planned, low-impact servicing.",
    href: "/industrial-iot/predictive-maintenance",
  },
  {
    title: "Industry 4.0 Solutions",
    description:
      "Affordable smart factory visibility for UK SMEs. We design and deliver edge monitoring, dashboards, and automation tools sized for your business.",
    href: "/industrial-iot/industry-40-solutions",
  },
  {
    title: "Portable Motor Diagnostic Kit",
    description:
      "Our flagship product — a rugged carry-case inspection kit with FFT vibration analysis, current signature analysis, and predictive health scoring for field maintenance teams.",
    href: "/industrial-iot/portable-diagnostic-kit",
    highlight: true,
  },
];

const whyPoints = [
  "Industrial expertise",
  "Affordable solutions for SMEs",
  "Scalable & future-ready",
  "End-to-end support",
];

export default function IndustrialIoTPage() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-xl">
            <p className="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
              Velynxia — Industrial Division
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Industrial IoT &amp; Smart Reliability Engineering
            </h1>
            <p className="mt-4 text-lg font-semibold text-green-400">
              Purpose-built for UK manufacturers. Not adapted from web tools.
            </p>
            <p className="mt-3 text-base leading-7 text-white/70">
              We design and deliver smart motor monitoring, predictive maintenance, and
              Industry 4.0 solutions that reduce downtime and protect your assets —
              built by specialists who understand industrial reliability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#solutions"
                className="inline-block rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
              >
                Explore Solutions
              </Link>
              <Link
                href="/contact"
                className="inline-block rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white hover:bg-white/10"
              >
                Book a Free Pilot
              </Link>
            </div>
          </div>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl lg:max-w-md">
            <Image
              src="/images/industrial-iot/Industrial-iot-frontpage.png"
              alt="Industrial IoT smart monitoring solutions"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Who We Help ── */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-8 text-center text-xl font-bold text-[#0b1f3a]">
            Who We Help
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 p-5 text-center"
              >
                <span className="text-3xl">{ind.icon}</span>
                <p className="text-sm font-semibold text-[#0b1f3a]">{ind.title}</p>
                <p className="text-xs text-black/55">{ind.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="bg-[#0f2a47] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-8 text-center text-xl font-bold text-white">
            Key Benefits
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-5 text-center"
              >
                <span className="text-3xl">{b.icon}</span>
                <p className="text-sm font-semibold text-white">{b.title}</p>
                <p className="text-xs text-white/60">{b.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section id="solutions" className="scroll-mt-4 bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Our Solutions</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className={`flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                  service.highlight
                    ? "border-green-400 bg-[#0b1f3a] text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                {service.highlight && (
                  <span className="mb-3 inline-block self-start rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Flagship
                  </span>
                )}
                <h3 className={`text-lg font-bold ${service.highlight ? "text-white" : "text-[#0b1f3a]"}`}>
                  {service.title}
                </h3>
                <p className={`mt-2 flex-1 text-sm leading-6 ${service.highlight ? "text-white/70" : "text-black/65"}`}>
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className={`mt-5 inline-block rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    service.highlight
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-[#0b1f3a] text-white hover:bg-[#0b3d91]"
                  }`}
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Splendid ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-[#0b3d91]/20 bg-[#0b1f3a]/5 p-8">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Why Velynxia</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
            We are a UK engineering technology company serving manufacturers nationwide. We build
            custom systems — we don&apos;t sell generic off-the-shelf boxes. Our Industrial
            IoT solutions are designed around your specific equipment, workflows, and
            budget. We work with you from pilot to full production deployment.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
            {whyPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="text-green-600">✓</span> {point}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
          >
            Talk to an Expert →
          </Link>
        </div>
      </section>

    </div>
  );
}
