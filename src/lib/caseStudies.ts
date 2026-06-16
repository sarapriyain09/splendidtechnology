export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  challenge: string;
  baseline: string[];
  solution: string[];
  implementation: string[];
  results: string[];
  stack: string[];
  relatedServiceHref: string;
  relatedServiceLabel: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "manufacturer-crm-lead-management-rollout",
    category: "CRM",
    title: "Manufacturer CRM Rollout for Lead and Quote Control",
    summary:
      "A UK manufacturing SME replaced spreadsheet-led lead tracking with a structured CRM workflow to improve follow-up discipline and quote conversion.",
    challenge:
      "Leads were captured across email, phone calls, and trade events with no single source of truth. Quote follow-ups were inconsistent and managers had limited forecast visibility.",
    baseline: [
      "Average first response time: 22 hours",
      "Quote follow-up completion: 58%",
      "Forecast variance: high and unpredictable",
      "Lead source attribution: inconsistent",
    ],
    solution: [
      "Implemented CRM pipeline with stage gates for qualification, technical review, quote, and follow-up",
      "Added SLA timers and overdue task automation",
      "Standardized lead source and product segment fields",
      "Introduced weekly pipeline review dashboard",
    ],
    implementation: [
      "Week 1: process mapping and stage design",
      "Week 2: data migration and field standardization",
      "Week 3: team onboarding and role-based dashboards",
      "Week 4: go-live with review cadence",
    ],
    results: [
      "First response time reduced from 22 hours to 4.5 hours",
      "Quote follow-up completion increased from 58% to 91%",
      "Pipeline visibility improved across sales and management",
      "Stronger attribution for trade event and inbound channels",
    ],
    stack: ["Custom CRM", "Workflow automation", "Dashboards", "Lead routing"],
    relatedServiceHref: "/services/crm-for-manufacturers-uk",
    relatedServiceLabel: "CRM for Manufacturers UK",
  },
  {
    slug: "industrial-iot-downtime-reduction-programme",
    category: "Industrial IoT",
    title: "Industrial IoT Programme to Reduce Unplanned Downtime",
    summary:
      "A multi-line production site deployed condition monitoring on critical rotating assets to reduce emergency stoppages and improve maintenance planning.",
    challenge:
      "Maintenance teams were operating reactively with limited early warning indicators. Failures on critical motors created repeated production disruption and urgent callouts.",
    baseline: [
      "Frequent unplanned stoppages on critical assets",
      "High emergency maintenance and rush-parts spend",
      "No single reliability dashboard across lines",
      "Limited intervention lead time",
    ],
    solution: [
      "Installed condition monitoring sensors on priority assets",
      "Configured alert thresholds by asset class and criticality",
      "Built reliability dashboard with escalation workflows",
      "Introduced weekly anomaly triage meetings",
    ],
    implementation: [
      "Phase 1: asset criticality mapping",
      "Phase 2: pilot instrumentation and baseline trend capture",
      "Phase 3: alert tuning and maintenance workflow integration",
      "Phase 4: expanded rollout to additional lines",
    ],
    results: [
      "Reduced unplanned stoppages on monitored assets",
      "Improved lead time for planned interventions",
      "Lower reliance on emergency callouts",
      "Created shared visibility between reliability and operations teams",
    ],
    stack: ["Telemetry", "Condition monitoring", "Alerting", "Reliability dashboards"],
    relatedServiceHref: "/services/industrial-iot-for-manufacturers-uk",
    relatedServiceLabel: "Industrial IoT for Manufacturers UK",
  },
  {
    slug: "quote-to-order-workflow-digitalisation",
    category: "Digitalisation",
    title: "Quote-to-Order Workflow Digitalisation for Engineering SME",
    summary:
      "An engineering SME digitized its quote-to-order process to remove handoff delays between commercial, technical, and operations teams.",
    challenge:
      "The quote lifecycle depended on email chains and manual reminders. Approval delays and missing context reduced conversion and affected delivery confidence.",
    baseline: [
      "Slow handoff between sales and technical teams",
      "Low visibility on quote status and blockers",
      "Inconsistent approval pathways",
      "Manual reporting effort each week",
    ],
    solution: [
      "Mapped end-to-end quote-to-order workflow",
      "Implemented role-based approval and escalation logic",
      "Created stage-based SLAs and exception alerts",
      "Deployed management dashboard for throughput and bottlenecks",
    ],
    implementation: [
      "Discovery and bottleneck mapping",
      "Workflow and approval policy design",
      "Digital rollout by department",
      "Post-launch optimization and KPI reviews",
    ],
    results: [
      "Faster quote progression through approval stages",
      "Greater predictability in order conversion planning",
      "Reduced manual status chasing across teams",
      "Improved leadership visibility over pipeline risk",
    ],
    stack: ["Workflow automation", "Approval engine", "Operational dashboards", "KPI tracking"],
    relatedServiceHref: "/services/software-development",
    relatedServiceLabel: "Digitalisation Services",
  },
  {
    slug: "supplier-discovery-and-qualification-system",
    category: "Supply Chain",
    title: "Supplier Discovery and Qualification System for Industrial Procurement",
    summary:
      "A manufacturing team implemented a structured supplier discovery and qualification workflow to improve sourcing speed and reduce vendor risk.",
    challenge:
      "Supplier data lived in disconnected documents and inboxes, making due diligence and comparison slow. Procurement decisions lacked a consistent score framework.",
    baseline: [
      "Long cycle times for new supplier qualification",
      "Fragmented supplier records",
      "Inconsistent risk and capability assessment",
      "Low auditability of final supplier decisions",
    ],
    solution: [
      "Created standardized supplier profile schema",
      "Built qualification scorecards and review checkpoints",
      "Added approval workflow for commercial and technical sign-off",
      "Implemented searchable supplier decision log",
    ],
    implementation: [
      "Supplier data model definition",
      "Scorecard and governance workshop",
      "Workflow launch with procurement team",
      "Quarterly requalification cadence setup",
    ],
    results: [
      "Faster shortlisting and qualification decisions",
      "Improved transparency on supplier selection rationale",
      "Better compliance and audit readiness",
      "Reduced sourcing friction for priority projects",
    ],
    stack: ["Supplier workflow", "Scorecards", "Approval routing", "Decision logs"],
    relatedServiceHref: "/services/software-development#erp",
    relatedServiceLabel: "Operations, ERP and Supply Chain",
  },
  {
    slug: "ai-assisted-sales-and-service-triage",
    category: "AI",
    title: "AI-Assisted Sales and Service Triage for Industrial SME",
    summary:
      "An industrial SME deployed AI-assisted triage for inbound enquiries and service issues, improving response consistency and routing speed.",
    challenge:
      "Commercial and service teams manually triaged inbound requests with variable quality and delays during peak periods.",
    baseline: [
      "Slow and inconsistent enquiry classification",
      "Manual handoff overload during busy periods",
      "Limited visibility on triage quality",
      "Delayed response for lower-volume channels",
    ],
    solution: [
      "Implemented AI-assisted intent classification for inbound channels",
      "Connected triage outputs to CRM and task workflows",
      "Defined human approval checkpoints for high-risk actions",
      "Added quality monitoring for triage accuracy",
    ],
    implementation: [
      "Intent taxonomy and routing logic design",
      "Pilot on selected enquiry channels",
      "Human-in-the-loop QA iteration",
      "Scaled rollout with weekly model review",
    ],
    results: [
      "Faster initial routing for sales and service requests",
      "Improved consistency in categorization and ownership",
      "Reduced manual triage workload",
      "Clearer visibility on inbound demand patterns",
    ],
    stack: ["AI workflow", "CRM integration", "Task automation", "QA dashboards"],
    relatedServiceHref: "/services/ai-solutions",
    relatedServiceLabel: "AI Solutions",
  },
];

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
