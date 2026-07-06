# Go/No-Go Checklist (Dry-Run) - 2026-06-21

## Decision Snapshot
- Verdict: **GO for scheduled maintenance window**
- Condition: Keep Automation/Analytics route-specific checks as informational (current root routes return 404 pre-cutover as well).

## Hard Gates
- Remaining NOT VALID shadow bigint FKs: `0`
- Eligible text->bigint PK swap tables: `30`
- Legacy FKs missing shadow bigint FK counterpart: `0`
- Eligible tables with NULL `id_bigint`: `0`

## Operational Snapshot
- PM2 core app processes: online (`splendid-crm`, `sales`, `marketing`, `automation`, `analytics`, `callcrm-api`, `callcrm-web`)
- Public smoke:
  - `https://crm.velynxia.com/login` -> 200
  - `https://sales.velynxia.com/login` -> 200
  - `https://marketing.velynxia.com/login` -> 200
  - `https://callcrm.velynxia.com` -> 200
  - `https://automation.velynxia.com` -> 404
  - `https://analytics.velynxia.com` -> 404

## Exact Maintenance Commands (Pi)
Run from local machine in this order.

### 1) Fresh backup
```powershell
ssh sarapriyain@192.168.0.64 "mkdir -p ~/backups/velynxia && docker exec callcrm-postgres pg_dump -U postgres -d velynxia_db -Fc -f /tmp/velynxia_pre_bigint_cutover_2026-06-21.dump && docker cp callcrm-postgres:/tmp/velynxia_pre_bigint_cutover_2026-06-21.dump ~/backups/velynxia/velynxia_pre_bigint_cutover_2026-06-21.dump && docker exec callcrm-postgres rm -f /tmp/velynxia_pre_bigint_cutover_2026-06-21.dump"
```

### 2) Stop write traffic (maintenance mode)
```powershell
ssh sarapriyain@192.168.0.64 "pm2 stop splendid-crm sales marketing automation analytics callcrm-api callcrm-web"
```

### 3) Execute cutover script
```powershell
Get-Content "scripts/db/2026-06-21-finalize-bigint-cutover.sql" -Raw | ssh sarapriyain@192.168.0.64 "docker exec -i callcrm-postgres psql -v ON_ERROR_STOP=1 -U postgres -d velynxia_db"
```

### 4) Restart apps
```powershell
ssh sarapriyain@192.168.0.64 "pm2 start splendid-crm sales marketing automation analytics callcrm-api callcrm-web && pm2 save"
```

### 5) Post-cutover PK type check
```powershell
ssh sarapriyain@192.168.0.64 "docker exec -i callcrm-postgres psql -U postgres -d velynxia_db <<'SQL'
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
SQL"
```

### 6) Post-cutover smoke
```powershell
ssh sarapriyain@192.168.0.64 'for u in https://crm.velynxia.com/login https://sales.velynxia.com/login https://marketing.velynxia.com/login https://callcrm.velynxia.com; do echo "--- $u"; curl -I -s "$u" | head -n 1; done'
```
