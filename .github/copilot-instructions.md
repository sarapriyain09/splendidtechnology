# GitHub Copilot Instructions - UK MTD Ready Accounting

## Objective
Build Velynxia Accounting to be MTD-ready from the first release.

The MVP does not need to submit VAT returns to HMRC, but all bookkeeping, VAT calculations, journals, reports, and audit records must be designed so that HMRC MTD integration can be added without redesigning the system.

## UK Standards Baseline
- Follow UK accounting standards and established industry practices.
- Support UK GAAP workflows (commonly FRS 102 or FRS 105 depending on company profile).
- Support Making Tax Digital (MTD) readiness requirements for VAT-registered businesses.
- Follow HMRC VAT rules and tax-code structures.
- Do not invent alternative accounting methods that conflict with standard UK accounting practice.

## Industry Standard Accounting Flow
Design workflows around standard accounting process expectations.

Sales side:
- Customer -> Quotation -> Sales Order (optional) -> Invoice -> Payment -> Bank Reconciliation -> Financial Reports

Purchasing side:
- Supplier -> Purchase Order (optional) -> Supplier Bill -> Payment -> Bank Reconciliation

## Ledger Architecture Rule
- General Ledger is the accounting system core.
- All financial documents post journal entries into the ledger.
- Reports derive from ledger/journal data only.
- Never mutate balances directly in application modules.

Expected model:
- Business document -> Journal Entries -> General Ledger -> Trial Balance / Profit & Loss / Balance Sheet / VAT / Cash Flow

## General Principles
- Never use single-entry bookkeeping.
- Always use double-entry accounting.
- Never store calculated account balances.
- Balances must always be calculated from journal entries.
- All accounting transactions must be fully auditable.
- Never permanently delete financial transactions.
- Use soft deletes only where appropriate, and never allow posted accounting transactions to be deleted.

## Digital Record Keeping
Maintain digital records for:
- Customers
- Suppliers
- Sales invoices
- Credit notes
- Supplier bills
- Payments received
- Payments made
- Expenses
- Bank transactions
- Journal entries
- VAT records

All records must include:
- UUID
- Company ID
- Created By
- Created Date
- Updated By
- Updated Date
- Source Module
- Audit Reference

## Double Entry Rules
Every financial transaction must automatically generate balanced journal entries.

Examples

Sales Invoice
- Debit: Accounts Receivable
- Credit: Sales Revenue
- Credit: VAT Output

Customer Payment
- Debit: Bank
- Credit: Accounts Receivable

Supplier Bill
- Debit: Expense
- Debit: VAT Input
- Credit: Accounts Payable

Supplier Payment
- Debit: Accounts Payable
- Credit: Bank

Journal entries must always balance.
- Debit Total = Credit Total

Never allow an unbalanced journal to be posted.

## Chart of Accounts
Provide a default UK Chart of Accounts.

Support:
- Assets
- Liabilities
- Equity
- Income
- Cost of Sales
- Expenses
- VAT Control
- Bank Accounts
- Accounts Receivable
- Accounts Payable

Allow users to create additional accounts.

Never hard-code account IDs.

## VAT Engine
Support UK VAT rates including:
- Standard Rate (20%)
- Reduced Rate (5%)
- Zero Rate (0%)
- Exempt
- Out of Scope

Each transaction line must store:
- Net Amount
- VAT Rate
- VAT Amount
- Gross Amount
- Tax Code

VAT calculations must be automatic.

Do not allow manual VAT totals unless the user has permission.

## Audit Trail
Audit every financial action.

Track:
- User
- Timestamp
- Record
- Action
- Previous Value
- New Value

Audit records must never be editable.

## Posting Rules
Documents have lifecycle states.

Invoice
- Draft
- Approved
- Posted
- Paid
- Cancelled

Only posted transactions create journal entries.

Draft documents must not affect financial reports.

## Bank Transactions
Support:
- Manual entry
- CSV import
- Bank reconciliation

Future:
- Open Banking integration

Each bank transaction should support matching against:
- Invoices
- Bills
- Expenses
- Journal Entries

## Financial Reports
Generate reports directly from journal entries.

Required reports:
- Profit & Loss
- Balance Sheet
- Trial Balance
- General Ledger
- VAT Summary
- VAT Detail
- Aged Receivables
- Aged Payables
- Cash Flow (future)

Never store report totals in the database.

## MTD Readiness
Design the architecture to support future HMRC Making Tax Digital integration.

Future integration should include:
- HMRC OAuth authentication
- VAT obligations retrieval
- VAT return generation
- VAT submission
- Submission history
- Filing receipts
- Error handling

Do not implement HMRC API calls in the MVP.

Ensure the data model already contains the required VAT information.

## Validation Rules
Do not allow:
- Negative VAT
- Invalid tax codes
- Unbalanced journals
- Deleting posted transactions
- Editing historical VAT periods without authorization
- Editing reconciled bank transactions

## Security
Use role-based permissions.

Roles:
- Owner
- Accountant
- Finance Manager
- Staff

Only authorized users may:
- Post journals
- Close accounting periods
- Modify VAT settings
- Reverse posted transactions

## Accounting Periods
Support:
- Open Period
- Closed Period
- Locked Period

Do not allow users to modify transactions in closed periods unless they have the appropriate permission.

## Future HMRC Integration
Keep the code modular.

Create separate services for:
- VAT Engine
- Accounting Engine
- Reporting Engine
- HMRC Integration

Never mix HMRC API logic with accounting business logic.

## Development Rule
Every financial transaction must pass through the Accounting Engine.

No module should update account balances directly.

All balances must be derived from journal entries.

Accounting Engine is the single source of truth for all financial reporting.

## Product Design Reference Rule
- Use products like Xero, Sage, and QuickBooks as UX/navigation references only.
- Do not reverse-engineer UI into accounting logic.

## Additional Scoped Instructions
- Master platform constitution instructions are defined in `.github/instructions/platform-master.instructions.md` and apply to `**`.
- Agent platform architecture instructions are defined in `.github/instructions/agent-platform.instructions.md` and apply to `services/agent-platform/**`.
- Agent platform consumer integration instructions are defined in `.github/instructions/agent-platform-consumers.instructions.md` and apply to `apps/**`.
- Shared RAG platform architecture instructions are defined in `.github/instructions/rag-platform.instructions.md` and apply to `services/rag/**`.
- Accounting logic must be standards-based: General Ledger -> Journal Entries -> Chart of Accounts.