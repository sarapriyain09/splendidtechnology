-- Phase 2 for BIGINT + UUID consolidation.
-- Non-breaking: add shadow BIGINT foreign keys based on existing text/cuid foreign keys.

DO $$
DECLARE
  r RECORD;
  shadow_col text;
  idx_name text;
  fk_name text;
BEGIN
  FOR r IN
    SELECT
      src_ns.nspname AS src_schema,
      src_cls.relname AS src_table,
      src_att.attname AS src_col,
      tgt_ns.nspname AS tgt_schema,
      tgt_cls.relname AS tgt_table,
      tgt_att.attname AS tgt_col
    FROM pg_constraint c
    JOIN pg_class src_cls ON src_cls.oid = c.conrelid
    JOIN pg_namespace src_ns ON src_ns.oid = src_cls.relnamespace
    JOIN pg_class tgt_cls ON tgt_cls.oid = c.confrelid
    JOIN pg_namespace tgt_ns ON tgt_ns.oid = tgt_cls.relnamespace
    JOIN unnest(c.conkey, c.confkey) WITH ORDINALITY AS cols(src_attnum, tgt_attnum, ord) ON TRUE
    JOIN pg_attribute src_att ON src_att.attrelid = src_cls.oid AND src_att.attnum = cols.src_attnum
    JOIN pg_attribute tgt_att ON tgt_att.attrelid = tgt_cls.oid AND tgt_att.attnum = cols.tgt_attnum
    WHERE c.contype = 'f'
      AND src_ns.nspname = 'public'
      AND tgt_ns.nspname = 'public'
      AND tgt_att.attname = 'id'
      AND EXISTS (
        SELECT 1
        FROM information_schema.columns ic
        WHERE ic.table_schema = tgt_ns.nspname
          AND ic.table_name = tgt_cls.relname
          AND ic.column_name = 'id_bigint'
      )
  LOOP
    shadow_col := r.src_col || '_bigint';
    idx_name := r.src_table || '_' || shadow_col || '_idx';
    fk_name := r.src_table || '_' || shadow_col || '_fkey';

    EXECUTE format(
      'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS %I BIGINT',
      r.src_schema,
      r.src_table,
      shadow_col
    );

    EXECUTE format(
      'UPDATE %I.%I AS src
         SET %I = tgt.id_bigint
        FROM %I.%I AS tgt
       WHERE src.%I IS NULL
         AND src.%I IS NOT NULL
         AND src.%I = tgt.%I',
      r.src_schema,
      r.src_table,
      shadow_col,
      r.tgt_schema,
      r.tgt_table,
      shadow_col,
      r.src_col,
      r.src_col,
      r.tgt_col
    );

    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON %I.%I (%I)',
      idx_name,
      r.src_schema,
      r.src_table,
      shadow_col
    );

    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint c2
      JOIN pg_class cls2 ON cls2.oid = c2.conrelid
      JOIN pg_namespace ns2 ON ns2.oid = cls2.relnamespace
      WHERE ns2.nspname = r.src_schema
        AND cls2.relname = r.src_table
        AND c2.conname = fk_name
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I.%I
           ADD CONSTRAINT %I
           FOREIGN KEY (%I)
           REFERENCES %I.%I (id_bigint)
           NOT VALID',
        r.src_schema,
        r.src_table,
        fk_name,
        shadow_col,
        r.tgt_schema,
        r.tgt_table
      );
    END IF;
  END LOOP;
END $$;
