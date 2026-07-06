---
applyTo: "apps/**"
---

# Velynxia Agent Platform Consumer Instructions

## Objective
All application modules must consume AI capabilities through the shared Agent Platform, not by embedding direct LLM orchestration logic inside app code.

This applies to Growth Platform, AI Media Suite, Accounting, Avatar Studio, and future apps.

## Integration Boundary
Applications are consumers of the Agent Platform.

Allowed app responsibilities:
- capture user intent
- enforce app permissions
- build validated request payloads
- call Agent Platform APIs or SDK adapters
- render responses and approval states

Not allowed in app modules:
- direct LLM provider calls
- custom orchestration pipelines
- agent planning logic duplicated in app code
- direct tool invocation that bypasses platform governance

## Required Integration Pattern
Use a dedicated adapter layer in each app.

Suggested locations:
- lib/agent-platform
- services/agent-platform-client

Adapter responsibilities:
- typed request and response contracts
- tenant and user context propagation
- correlation ID propagation
- timeout and retry policy
- standardized error mapping for UI and API layers

## Multi-Tenancy and Security
Every outbound Agent Platform request must include:
- tenant ID
- user ID
- role or permission scope
- request source module

Never send secrets in prompt fields.
Never bypass tenant scoping for cross-app operations.

## Human Approval
For mutating or customer-facing actions, apps must support approval states:
- draft
- pending_approval
- approved
- rejected
- executed
- failed

UI must clearly show who approved and when.

## Event-Driven Consumption
Prefer events for cross-module workflows instead of direct app-to-app calls.

Supported examples:
- lead.created
- quote.approved
- invoice.overdue
- video.generated
- customer.registered

App-side rules:
- consumers must be idempotent
- event handlers must validate schema version
- failures must go to dead-letter handling path

## Prompt and Content Rules
Apps should reference prompt keys or templates managed by Agent Platform.
Do not hardcode domain prompts across application controllers or pages.

## Observability
Log app-level Agent Platform interactions with:
- request ID and correlation ID
- tenant and user
- action type
- latency
- success or failure

Do not log sensitive prompt content or secrets.

## Reliability Standards
- enforce request timeouts
- implement bounded retries for transient failures
- expose graceful fallback states in UI
- show actionable errors to users

## Testing Standards
Each app integration must include:
- adapter unit tests
- contract tests for request and response schemas
- one end-to-end test for approval workflow path

## Expected Outcome
Adding Agent Platform capability to an app should only require:
1. Implementing or extending that app adapter
2. Wiring one endpoint or UI action to the adapter
3. Subscribing to required events

No new app-specific orchestration framework should be introduced.
