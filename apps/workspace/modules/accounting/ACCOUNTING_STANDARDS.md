# Velynxia Accounting Standards Baseline (UK + MTD Ready)

This document is the implementation baseline for all accounting code in this module.

## Core Position

Do not invent custom accounting methods.

Implement Velynxia Accounting using UK-standard accounting practice so accountants can use the platform immediately without relearning accounting behavior.

## Standards and Compliance Baseline

- Double-entry bookkeeping is mandatory.
- UK GAAP-aligned workflows are required (commonly FRS 102 or FRS 105 depending on company profile).
- HMRC VAT rules and tax-code handling must be supported.
- MTD-ready architecture is required from first release.
- MVP does not include HMRC API submission, but data and architecture must support future integration without redesign.

## Standard Industry Workflow

Sales flow:
- Customer -> Quotation -> Sales Order (optional) -> Invoice -> Payment -> Bank Reconciliation -> Financial Reports

Supplier flow:
- Supplier -> Purchase Order (optional) -> Supplier Bill -> Payment -> Bank Reconciliation

## Accounting Engine and Ledger Rules

- Never use single-entry bookkeeping.
- Every financial transaction must post balanced journal entries.
- Debit total must always equal credit total.
- Do not allow unbalanced journals to be posted.
- Do not update account balances directly.
- All balances must be derived from journal entries in the General Ledger.
- Posted transactions are immutable; corrections must use reversing/correcting entries.

Reference model:
- Business document -> Journal Entries -> General Ledger -> Reports

## Mandatory Double-Entry Examples

Sales invoice:
- Debit Accounts Receivable
- Credit Sales Revenue
- Credit VAT Output

Customer payment:
- Debit Bank
- Credit Accounts Receivable

Supplier bill:
- Debit Expense
- Debit VAT Input
- Credit Accounts Payable

Supplier payment:
- Debit Accounts Payable
- Credit Bank

## Chart of Accounts Requirements

Provide default UK chart structure and allow extension.

Support categories:
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

Rules:
- Never hard-code account IDs.
- Use account types/categories and configuration-based mapping.

## VAT Requirements

Support VAT rates:
- Standard (20%)
- Reduced (5%)
- Zero (0%)
- Exempt
- Out of Scope

Each taxable transaction line stores:
- Net amount
- VAT rate
- VAT amount
- Gross amount
- Tax code

Rules:
- VAT calculations should be automatic.
- Manual VAT totals require explicit permission.
- Do not allow negative VAT or invalid tax codes.

## Period, Reconciliation, and Edit Controls

- Support accounting periods: Open, Closed, Locked.
- Restrict edits in closed/locked periods by role/permission.
- Restrict edits to reconciled bank transactions.
- Do not delete posted transactions.

## Audit and Digital Record Keeping

Track digital records for:
- Customers, suppliers, invoices, credit notes, bills, payments, expenses, bank transactions, journals, VAT records

Every financial record should include:
- UUID
- company_id
- created_by
- created_at
- updated_by
- updated_at
- source_module
- audit_reference

Audit must capture:
- User
- Timestamp
- Record
- Action
- Previous value
- New value
- Reason (where applicable)

Audit records are immutable.

## Reporting Rules

Generate reports from ledger/journal data only.

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

Do not store report totals as source-of-truth balances.

## Product Reference Rule

Use Xero/Sage/QuickBooks as UX and navigation references only.

Do not derive accounting logic from screen layouts.

Accounting logic must remain standards-driven and centered on:
- General Ledger
- Journal Entries
- Chart of Accounts
