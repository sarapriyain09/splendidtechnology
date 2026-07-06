-- Phase 3 for BIGINT + UUID consolidation.
-- Validate previously added NOT VALID shadow bigint foreign-key constraints.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      n.nspname AS schema_name,
      c.relname AS table_name,
      con.conname AS constraint_name
    FROM pg_constraint con
    JOIN pg_class c ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE con.contype = 'f'
      AND n.nspname = 'public'
      AND con.conname LIKE '%_bigint_fkey'
      AND NOT con.convalidated
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I VALIDATE CONSTRAINT %I',
      r.schema_name,
      r.table_name,
      r.constraint_name
    );
  END LOOP;
END $$;
