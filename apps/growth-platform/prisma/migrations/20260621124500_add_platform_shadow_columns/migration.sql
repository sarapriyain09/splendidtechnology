-- Phase 1 for BIGINT + UUID consolidation.
-- Non-breaking: keeps existing primary/foreign keys intact and adds shadow columns.

DO $$
DECLARE
  t text;
  has_created_camel boolean;
  has_updated_camel boolean;
  seq_name text;
  tables text[] := ARRAY[
    -- shared platform tables
    'companies',
    'contacts',
    'activities',
    'tasks',
    'notes',
    'documents',
    'users',
    'attachments',
    'tags',
    'entity_tags',
    'audit_logs',

    -- sales
    'sales_leads',
    'sales_opportunities',
    'sales_quotes',
    'sales_quote_items',
    'sales_orders',
    'sales_products',
    'products',

    -- callcrm
    'call_campaigns',
    'call_logs',
    'call_recordings',
    'call_dispositions',

    -- marketing
    'marketing_campaigns',
    'marketing_email_campaigns',
    'marketing_sms_campaigns',
    'marketing_segments',
    'marketing_forms',
    'marketing_landing_pages',
    'marketing_newsletters',

    -- automation
    'workflow_definitions',
    'workflow_instances',
    'workflow_logs',
    'workflows',

    -- analytics
    'dashboard_widgets',
    'analytics_reports'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF to_regclass(t) IS NULL THEN
      CONTINUE;
    END IF;

    -- Shadow BIGINT identifier for gradual cutover.
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS id_bigint BIGINT', t);
    seq_name := t || '_id_bigint_seq';
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I', seq_name);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN id_bigint SET DEFAULT nextval(%L)', t, seq_name);
    EXECUTE format('UPDATE %I SET id_bigint = nextval(%L) WHERE id_bigint IS NULL', t, seq_name);
    EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I (id_bigint)', t || '_id_bigint_key', t);

    -- Standardized platform lifecycle columns.
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ', t);

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = t AND column_name = 'createdAt'
    ) INTO has_created_camel;

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = t AND column_name = 'updatedAt'
    ) INTO has_updated_camel;

    IF has_created_camel THEN
      EXECUTE format('UPDATE %I SET created_at = COALESCE(created_at, "createdAt", now()) WHERE created_at IS NULL', t);
    ELSE
      EXECUTE format('UPDATE %I SET created_at = COALESCE(created_at, now()) WHERE created_at IS NULL', t);
    END IF;

    IF has_updated_camel THEN
      EXECUTE format('UPDATE %I SET updated_at = COALESCE(updated_at, "updatedAt", now()) WHERE updated_at IS NULL', t);
    ELSE
      EXECUTE format('UPDATE %I SET updated_at = COALESCE(updated_at, now()) WHERE updated_at IS NULL', t);
    END IF;

    EXECUTE format('ALTER TABLE %I ALTER COLUMN created_at SET DEFAULT now()', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN updated_at SET DEFAULT now()', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN created_at SET NOT NULL', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN updated_at SET NOT NULL', t);

    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_by BIGINT', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_by BIGINT', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1', t);
  END LOOP;
END $$;
