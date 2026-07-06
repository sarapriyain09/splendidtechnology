# Velynxia Agentic AI - 90-Day Execution Scorecard

## Objective
Make Agentic AI the primary value proposition by proving measurable business outcomes in one revenue-critical workflow: enquiry to proposal.

## Scope (Top 3 Agents Only)
1. AI Receptionist Agent
- Channels: website chat and email (WhatsApp optional in this phase)
- Core job: capture enquiry, qualify lead, create CRM Lead Contact Opportunity records

2. AI Sales Follow-up Agent
- Core job: research lead context, draft first outreach, schedule follow-ups, update CRM status

3. Proposal Agent
- Core job: build draft quotation from CRM context, catalog, pricing rules, and margin guardrails; route for approval and send

## Success KPIs (Measured Weekly)
| KPI | Definition | Baseline (Week 1) | Day 45 Target | Day 90 Target | Owner |
|---|---|---:|---:|---:|---|
| Lead Response SLA | Median minutes from enquiry to first response | TBD | <= 15 min | <= 5 min | Growth Ops |
| Qualification Completion | % enquiries with complete qualification fields | TBD | >= 70% | >= 85% | Reception Agent |
| Lead to Meeting Conversion | % qualified leads booked into meetings | TBD | +15% vs baseline | +30% vs baseline | Sales Team |
| Proposal Turnaround Time | Median hours from request to approved quote sent | TBD | <= 12 hrs | <= 2 hrs | Proposal Agent |
| Human Effort Saved | Hours/week reduced in manual CRM and proposal work | TBD | >= 10 hrs/week | >= 25 hrs/week | RevOps |
| Agent Reliability | % runs completed without manual technical intervention | TBD | >= 95% | >= 98% | Platform Team |

## 90-Day Milestones
### Days 1-30 (Foundation + Controlled Pilot)
1. Finalize contracts for agent inputs, outputs, and audit events.
2. Implement tool permission tiers: read, draft, execute.
3. Ship Reception Agent v1 for website chat and email intake.
4. Add human approval mode: Draft and Approve for all outbound actions.
5. Instrument KPI tracking dashboards and event logs.

Exit criteria:
- Reception Agent handling live pilot traffic for at least one business unit.
- KPI baselines captured for all scorecard metrics.

### Days 31-60 (Automation + Throughput)
1. Ship Sales Follow-up Agent v1 with cadence logic and CRM status updates.
2. Ship Proposal Agent v1 using pricing and margin policy checks.
3. Introduce confidence scoring and low-confidence auto-escalation.
4. Add CEO Morning Brief beta summary from pilot metrics.

Exit criteria:
- End-to-end enquiry to proposal flow operational in pilot.
- At least 30 completed agent-assisted opportunities in pilot sample.

### Days 61-90 (Scale + Decision)
1. Expand pilot to second segment or region.
2. Optimize prompts, planner rules, and fallback paths from error analytics.
3. Enable selective low-risk auto-execute (no approval) for predefined actions.
4. Publish internal playbook for sales and operations teams.

Exit criteria:
- KPI targets hit or trendline within 10% of Day 90 target.
- Stable ops with on-call runbook and incident thresholds.

## Go/No-Go Gates
### Gate 1 - Day 30
Go if all are true:
1. Reception Agent reliability >= 95%.
2. Zero critical compliance incidents in audit logs.
3. Qualification completion improves by at least 10% over baseline trend.

No-Go actions if failed:
1. Freeze new features for 2 weeks.
2. Fix tool permissions, schema gaps, and fallback paths.
3. Re-run pilot with tighter scope.

### Gate 2 - Day 60
Go if all are true:
1. End-to-end flow completing with measurable cycle-time reduction.
2. Proposal turnaround reduced by at least 40% from baseline.
3. Meeting conversion trend positive for 3 consecutive weeks.

No-Go actions if failed:
1. Restrict agents to Draft and Approve mode only.
2. Rework scoring and escalation logic before scaling.

### Gate 3 - Day 90
Scale to Phase 2 if all are true:
1. At least 4 of 6 KPI targets achieved.
2. No unresolved high-severity trust or compliance issues.
3. Unit economics acceptable: cost per agent-assisted opportunity below planned threshold.

Hold and optimize if failed:
1. Continue with top-performing two agents only.
2. Delay new agent categories until reliability and ROI recover.

## Non-Negotiable Guardrails
1. Every execution action is permission-checked and audit-logged.
2. Finance or pricing-impacting actions require policy checks and approval unless explicitly whitelisted.
3. Memory remains tenant-scoped and cross-app access is policy-based.
4. Human override is available in all workflows.

## Team Accountability
| Area | Primary Team | Responsibility |
|---|---|---|
| Orchestrator + Tools | Platform Engineering | Reliability, permissions, observability |
| Reception + Sales Agent Logic | Growth Product + RevOps | Qualification quality and conversion |
| Proposal Policy Logic | Commercial + Finance | Pricing rules, margin guardrails, approvals |
| KPI Reporting | Data + Ops | Weekly scorecard reporting and recommendations |

## Weekly Operating Rhythm
1. Monday: scorecard review, blockers, and gate risk assessment.
2. Wednesday: prompt or workflow tuning release.
3. Friday: KPI readout, incident review, and next-week experiment plan.

## Weekly Template

Use this dashboard for weekly operating reviews:
- `docs/strategy/agentic-ai-weekly-ops-dashboard-template.md`
