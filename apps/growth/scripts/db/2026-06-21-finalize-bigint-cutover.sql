-- Final bigint ID cutover plan (Phase 4/5).
-- DO NOT run during business hours.
-- Preconditions:
-- 1) App code is ready for bigint IDs on canonical id/fk columns.
-- 2) Backups are fresh.
-- 3) Maintenance window is active.

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '15min';
SET LOCAL idle_in_transaction_session_timeout = '15min';

-- Target tables: currently use text id + bigint shadow id_bigint.
CREATE TEMP TABLE _cutover_tables AS
SELECT t.table_name
FROM information_schema.tables t
JOIN information_schema.columns c_id
  ON c_id.table_schema=t.table_schema
 AND c_id.table_name=t.table_name
 AND c_id.column_name='id'
 AND c_id.data_type='text'
JOIN information_schema.columns c_big
  ON c_big.table_schema=t.table_schema
 AND c_big.table_name=t.table_name
 AND c_big.column_name='id_bigint'
 AND c_big.data_type='bigint'
WHERE t.table_schema='public'
  AND t.table_type='BASE TABLE';

-- Safety: id_bigint must be present for all rows before swapping PK.
DO $$
DECLARE
  r RECORD;
  missing_count bigint;
BEGIN
  FOR r IN SELECT table_name FROM _cutover_tables ORDER BY table_name LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE id_bigint IS NULL', r.table_name) INTO missing_count;
    IF missing_count > 0 THEN
      RAISE EXCEPTION 'Cutover blocked: %.id_bigint has % NULL rows', r.table_name, missing_count;
    END IF;
  END LOOP;
END $$;

-- Step 1: swap FK columns from <fk>_bigint to canonical <fk> for tables that reference target tables.
DO $$
DECLARE
  fk RECORD;
  big_fk_name text;
BEGIN
  FOR fk IN
    SELECT
      con.conname AS old_fk_name,
      src.relname AS src_table,
      src_col.attname AS src_column,
      tgt.relname AS tgt_table
    FROM pg_constraint con
    JOIN pg_class src ON src.oid = con.conrelid
    JOIN pg_namespace src_ns ON src_ns.oid = src.relnamespace
    JOIN pg_class tgt ON tgt.oid = con.confrelid
    JOIN pg_namespace tgt_ns ON tgt_ns.oid = tgt.relnamespace
    JOIN unnest(con.conkey, con.confkey) WITH ORDINALITY AS cols(src_attnum, tgt_attnum, ord) ON TRUE
    JOIN pg_attribute src_col ON src_col.attrelid = src.oid AND src_col.attnum = cols.src_attnum
    JOIN pg_attribute tgt_col ON tgt_col.attrelid = tgt.oid AND tgt_col.attnum = cols.tgt_attnum
    WHERE con.contype = 'f'
      AND src_ns.nspname = 'public'
      AND tgt_ns.nspname = 'public'
      AND tgt_col.attname = 'id'
      AND tgt.relname IN (SELECT table_name FROM _cutover_tables)
      AND src_col.attname NOT LIKE '%_bigint'
      AND EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND c.table_name = src.relname
          AND c.column_name = src_col.attname || '_bigint'
      )
    ORDER BY tgt.relname, src.relname, con.conname
  LOOP
    SELECT con2.conname
    INTO big_fk_name
    FROM pg_constraint con2
    JOIN pg_class src2 ON src2.oid = con2.conrelid
    JOIN pg_namespace ns2 ON ns2.oid = src2.relnamespace
    JOIN unnest(con2.conkey) AS k2(attnum) ON TRUE
    JOIN pg_attribute a2 ON a2.attrelid = src2.oid AND a2.attnum = k2.attnum
    WHERE con2.contype = 'f'
      AND ns2.nspname = 'public'
      AND src2.relname = fk.src_table
      AND a2.attname = fk.src_column || '_bigint'
    LIMIT 1;

    IF big_fk_name IS NULL THEN
      RAISE EXCEPTION 'Cutover blocked: missing bigint FK constraint for %.%', fk.src_table, fk.src_column;
    END IF;

    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', fk.src_table, fk.old_fk_name);

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema='public'
        AND table_name=fk.src_table
        AND column_name=fk.src_column || '_text_legacy'
    ) THEN
      EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', fk.src_table, fk.src_column, fk.src_column || '_text_legacy');
    END IF;

    EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', fk.src_table, fk.src_column || '_bigint', fk.src_column);
    EXECUTE format('ALTER TABLE %I RENAME CONSTRAINT %I TO %I', fk.src_table, big_fk_name, fk.old_fk_name);
  END LOOP;
END $$;

-- Step 2: swap PK columns from id_bigint to canonical id.
DO $$
DECLARE
  r RECORD;
  old_pk text;
BEGIN
  FOR r IN SELECT table_name FROM _cutover_tables ORDER BY table_name LOOP
    SELECT con.conname
      INTO old_pk
    FROM pg_constraint con
    JOIN pg_class c ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE con.contype = 'p'
      AND n.nspname = 'public'
      AND c.relname = r.table_name
    LIMIT 1;

    IF old_pk IS NULL THEN
      RAISE EXCEPTION 'Cutover blocked: no primary key constraint for %', r.table_name;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema='public'
        AND table_name=r.table_name
        AND column_name='id_text_legacy'
    ) THEN
      EXECUTE format('ALTER TABLE %I RENAME COLUMN id TO id_text_legacy', r.table_name);
    END IF;

    EXECUTE format('ALTER TABLE %I RENAME COLUMN id_bigint TO id', r.table_name);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN id SET NOT NULL', r.table_name);
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', r.table_name, old_pk);
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I PRIMARY KEY (id)', r.table_name, r.table_name || '_pkey');
  END LOOP;
END $$;

-- Sanity summary after swap.
SELECT c.relname AS table_name,
       a.attname AS pk_column,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS pk_type
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN unnest(con.conkey) AS k(attnum) ON TRUE
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = k.attnum
WHERE con.contype = 'p'
  AND n.nspname = 'public'
  AND c.relname IN (SELECT table_name FROM _cutover_tables)
ORDER BY c.relname;

COMMIT;
