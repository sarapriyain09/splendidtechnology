# Tools

Tool registry and execution adapters.

Tool categories:

- app tools (CRM, Sales, Marketing, Accounting, Media)
- communication tools (email, calendar, WhatsApp)
- data tools (db, storage, api)

Execution rules:

- permission check before execution
- structured input/output schema
- audit log for every call

## Current Example

- `tools/email/EmailTool.ts` provides a mock `email.send` adapter for local flows.
- `tools/crm/CrmTool.ts` provides a mock `crm.opportunity.create` adapter for proposal workflows.

Agents should use tools through framework contracts rather than direct database access.
