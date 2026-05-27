import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industrial IoT Proof of Concept | Splendid Technology",
  description:
    "Early-stage Industrial IoT demonstration platform — edge monitoring on Raspberry Pi, AWS cloud analytics, real-time dashboards, and automated anomaly detection.",
  alternates: {
    canonical: "/proof-of-concept",
  },
  openGraph: {
    title: "Industrial IoT Proof of Concept | Splendid Technology",
    description:
      "Edge-based monitoring, cloud analytics, anomaly detection, and real-time dashboard visualisation — demonstrated on Raspberry Pi and AWS.",
  },
};

const demonstrated = [
  {
    icon: "📡",
    title: "Sensor Data Acquisition",
    detail:
      "Simulated sensor streams for Temperature, Humidity, Pressure, Vibration, and Energy — published via MQTT to a local Mosquitto broker on Raspberry Pi.",
  },
  {
    icon: "🖥️",
    title: "Edge Processing & Buffering",
    detail:
      "Python edge services subscribe to MQTT, validate and parse data, add timestamps, and store readings to a local SQLite buffer during internet outages.",
  },
  {
    icon: "🔄",
    title: "Offline Resilience & Sync",
    detail:
      "A replay/sync service queues pending data locally and automatically retransmits to AWS when connectivity is restored — no data loss during offline periods.",
  },
  {
    icon: "📊",
    title: "Local Dashboard (Grafana)",
    detail:
      "Grafana OSS running on the edge device provides live sensor dashboards, system health indicators, MQTT status, and buffer queue monitoring — fully offline capable.",
  },
  {
    icon: "☁️",
    title: "AWS Cloud Integration",
    detail:
      "AWS IoT Core receives MQTT telemetry, IoT Rules route data to DynamoDB, DynamoDB Streams trigger Lambda functions that publish metrics to CloudWatch.",
  },
  {
    icon: "📈",
    title: "Cloud Dashboard (CloudWatch)",
    detail:
      "AWS CloudWatch Dashboard visualises live sensor telemetry with 30-second refresh — displaying temperature, humidity, pressure, vibration, count, and alarm status.",
  },
  {
    icon: "🚨",
    title: "Automated Anomaly Alerts",
    detail:
      "CloudWatch Alarms detect threshold breaches and trigger automated email notifications — demonstrating end-to-end anomaly detection from edge to cloud.",
  },
  {
    icon: "⚙️",
    title: "Kubernetes Cloud Application Layer",
    detail:
      "Microservices deployed on Amazon EKS: FastAPI ingestion, JWT auth, replay sync, admin, and health monitoring services — with PostgreSQL and ElastiCache Redis.",
  },
];

const edgeStack = [
  "Raspberry Pi (Edge Hardware)",
  "Python (Edge Services)",
  "MQTT / Mosquitto Broker",
  "SQLite (Local Buffer)",
  "Grafana OSS (Local Dashboard)",
];

const cloudStack = [
  "AWS IoT Core",
  "Amazon DynamoDB",
  "AWS Lambda",
  "Amazon CloudWatch",
  "Amazon EKS (Kubernetes)",
  "FastAPI (Ingestion API)",
  "PostgreSQL (Amazon RDS)",
  "ElastiCache Redis",
  "Nginx Ingress",
];

const roadmap = [
  {
    phase: "Next",
    items: [
      "Real vibration sensor integration (accelerometer via I²C/SPI)",
      "FFT vibration spectrum analysis at the edge",
      "Current Signature Analysis (CSA) for motor fault detection",
    ],
  },
  {
    phase: "Near-term",
    items: [
      "Online insulation health indicators",
      "Motor-specific health scoring algorithms",
      "Portable diagnostic kit hardware integration",
    ],
  },
  {
    phase: "Vision",
    items: [
      "AI-assisted predictive maintenance insights",
      "Digital twin–based operational monitoring",
      "Affordable SME-ready monitoring platform",
    ],
  },
];

export default function ProofOfConceptPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <header className="rounded-2xl bg-[#0b1f3a] px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              Proof of Concept — Demonstration Platform
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Industrial IoT Monitoring Platform
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Early-stage Industrial IoT proof of concept demonstrating edge-based sensor
              monitoring, local and cloud dashboard visualisation, offline resilience,
              and automated anomaly detection — built on Raspberry Pi and AWS.
            </p>
            <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-5 text-amber-300/80">
              <strong className="text-amber-400">Important:</strong> This is an early-stage
              demonstration platform, not a certified or production-ready industrial monitoring
              system. Results and recommendations should support — not replace — qualified
              engineering inspection and established safety practices.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-white/50">
            <span>✅ Sensor simulation</span>
            <span>✅ Edge processing</span>
            <span>✅ Local dashboard</span>
            <span>✅ AWS cloud integration</span>
            <span>✅ Anomaly email alerts</span>
            <span>✅ Kubernetes microservices</span>
          </div>
        </div>
      </header>

      {/* Architecture */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Architecture Overview</h2>
        <p className="mt-1 text-sm text-black/55">
          End-to-end data flow from factory floor sensors to cloud analytics.
        </p>

        {/* Flow diagram */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-[640px] items-stretch gap-0">

            {/* Edge block */}
            <div className="flex-1 rounded-l-2xl border border-green-700/30 bg-green-950/20 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                Edge / Local · Raspberry Pi
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { step: "1", label: "Sensors", sub: "Temp · Humidity · Pressure · Vibration · Energy" },
                  { step: "2", label: "MQTT Broker", sub: "Mosquitto — topic: factory/telemetry" },
                  { step: "3", label: "Edge Services (Python)", sub: "Parse · Timestamp · Validate · Detect offline" },
                  { step: "4", label: "Local Buffer (SQLite)", sub: "Queue: pending / sent / failed" },
                  { step: "5", label: "Replay / Sync", sub: "Auto-retransmit when online" },
                  { step: "6", label: "Local Dashboard", sub: "Grafana OSS — offline capable" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#0b1f3a]">{item.label}</p>
                      <p className="text-[10px] text-black/50">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-3">
              <div className="flex flex-col items-center gap-1">
                <div className="h-0.5 w-10 bg-[#0b1f3a]/30" />
                <p className="text-[9px] text-black/40 whitespace-nowrap">Internet</p>
                <div className="h-0.5 w-10 bg-[#0b1f3a]/30" />
              </div>
            </div>

            {/* Cloud block */}
            <div className="flex-1 rounded-r-2xl border border-blue-700/30 bg-blue-950/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                AWS Cloud
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { step: "1", label: "AWS IoT Core", sub: "Receives MQTT messages" },
                  { step: "2", label: "IoT Rule", sub: "Routes to DynamoDB" },
                  { step: "3", label: "DynamoDB", sub: "Stores factoryTelemetry" },
                  { step: "4", label: "Lambda", sub: "Stream processor → CloudWatch metrics" },
                  { step: "5", label: "CloudWatch", sub: "Metrics · Alarms · Dashboard (30s refresh)" },
                  { step: "6", label: "Kubernetes (EKS)", sub: "FastAPI · Auth · Replay · Admin · Monitoring" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#0b1f3a]">{item.label}</p>
                      <p className="text-[10px] text-black/50">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Demonstrated */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#0b1f3a]">What We Demonstrated</h2>
        <p className="mt-1 text-sm text-black/55">
          Eight capabilities proven end-to-end in this proof of concept.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demonstrated.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-black/10 bg-white p-5"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-2 text-sm font-semibold text-[#0b1f3a]">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-black/60">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-green-700/20 bg-green-950/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-700">
            Edge Technology Stack
          </h3>
          <ul className="mt-4 space-y-2">
            {edgeStack.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-black/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-700/20 bg-blue-950/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Cloud Technology Stack
          </h3>
          <ul className="mt-4 space-y-2">
            {cloudStack.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-black/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dashboard screenshots */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Dashboard Visualisation</h2>
        <p className="mt-1 text-sm text-black/55">
          Live sensor data visualised at the edge (Grafana) and in the cloud (AWS CloudWatch).
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <div className="relative w-full aspect-video">
              <Image
                src="/images/industrial-iot/grafana-local.png"
                alt="Local Edge Dashboard — Grafana OSS showing Temperature, Vibration, RPM and Pressure panels in offline mode"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-[#0b1f3a]">Local Edge Dashboard (Grafana OSS)</p>
              <p className="mt-1 text-xs text-black/50">Offline-capable · Temperature · Vibration · RPM · Pressure</p>
            </div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <div className="relative w-full aspect-video">
              <Image
                src="/images/industrial-iot/aws-chart.png"
                alt="AWS CloudWatch Dashboard showing sensor-app telemetry with Temperature, Pressure, Vibration, RPM, Fault Count and Live Gauges panels"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-[#0b1f3a]">AWS CloudWatch Dashboard</p>
              <p className="mt-1 text-xs text-black/50">30s refresh · Temp · Pressure · Vibration · RPM · Fault Count · Live Gauges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Development Roadmap */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Current Development Focus</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-black/60">
          Current development activities are focused on expanding this proof of concept toward
          practical motor condition monitoring, FFT vibration analytics, Current Signature
          Analysis (CSA), and portable predictive maintenance systems for industrial SMEs.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {roadmap.map((phase) => (
            <div key={phase.phase} className="rounded-xl border border-black/10 bg-white p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">
                {phase.phase}
              </span>
              <ul className="mt-3 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-black/65">
                    <span className="mt-0.5 shrink-0 text-green-600">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl bg-[#0b1f3a] px-8 py-10 text-center text-white">
        <h2 className="text-xl font-bold">Interested in a Pilot Engagement?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
          We are actively seeking industrial partners to co-develop and validate our
          monitoring solutions in real operational environments. Contact us to discuss
          a pilot programme.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
          >
            Book a Pilot Discussion
          </Link>
          <Link
            href="/industrial-iot"
            className="rounded border border-white/20 px-5 py-2.5 text-sm text-white/80 hover:border-white/50 hover:text-white"
          >
            Our IoT Solutions
          </Link>
        </div>
      </section>

    </div>
  );
}
