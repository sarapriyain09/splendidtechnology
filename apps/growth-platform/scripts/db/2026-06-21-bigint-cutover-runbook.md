# BIGINT Cutover Runbook (Phase 4 -> 5)

## Scope
This runbook swaps canonical `id` and foreign-key columns from text/cuid to bigint for tables that already have shadow columns (`id_bigint`, `<fk>_bigint`).

Primary script:
- [scripts/db/2026-06-21-finalize-bigint-cutover.sql](scripts/db/2026-06-21-finalize-bigint-cutover.sql)

## Preconditions
1. Maintenance window approved.
2. Fresh backup completed.
3. App code tested against bigint canonical IDs in staging.
4. No active long transactions touching app tables.

## Dry Checks (Production)
Run before cutover:

```sql
SELECT COUNT(*) AS remaining_not_valid_shadow_fks
FROM pg_constraint
WHERE contype='f' AND conname LIKE '%_bigint_fkey' AND NOT convalidated;
```

Expected: `0`.

## Execute
Use psql with ON_ERROR_STOP so any failure aborts immediately.

```bash
docker exec -i callcrm-postgres psql -v ON_ERROR_STOP=1 -U postgres -d velynxia_db < scripts/db/2026-06-21-finalize-bigint-cutover.sql
```

## Post Checks
1. Confirm target PKs are bigint:

```sql
SELECT c.relname AS table_name,
       a.attname AS pk_column,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS pk_type
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN unnest(con.conkey) AS k(attnum) ON TRUE
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = k.attnum
WHERE con.contype='p' AND n.nspname='public'
ORDER BY c.relname;
```

2. Smoke tests:
- CRM login/API
- Sales opportunities/leads APIs
- Marketing campaigns APIs
- CallCRM API root
- Automation/Analytics route-specific health endpoints

## Rollback Approach
If failure occurs mid-script, transaction aborts and no commit is applied.
If cutover is committed but app behavior regresses, execute a dedicated reverse swap script (to be generated immediately before go-live against current schema snapshot).
