-- Add UUID external identifiers without changing existing primary keys/relationships.
-- Idempotent: safe to rerun.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'users',
    'companies',
    'contacts',
    'activities',
    'tasks',
    'notes',
    'documents',
    'tags',
    'attachments',
    'sales_leads',
    'sales_pipelines',
    'sales_pipeline_stages',
    'sales_opportunities',
    'products',
    'sales_quotes',
    'sales_quote_items',
    'sales_orders',
    'call_campaigns',
    'call_logs',
    'call_recordings',
    'call_dispositions',
    'marketing_campaigns',
    'marketing_email_campaigns',
    'marketing_sms_campaigns',
    'marketing_segments',
    'marketing_forms',
    'marketing_landing_pages',
    'marketing_newsletters',
    'workflows',
    'workflow_triggers',
    'workflow_conditions',
    'workflow_actions',
    'workflow_logs',
    'prompt_history',
    'analytics_reports',
    'analytics_snapshots',
    'dashboard_widgets',
    'licenses'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF to_regclass(t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS uuid UUID', t);
      EXECUTE format('UPDATE %I SET uuid = gen_random_uuid() WHERE uuid IS NULL', t);
      EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I (uuid)', t || '_uuid_key', t);
      EXECUTE format('ALTER TABLE %I ALTER COLUMN uuid SET NOT NULL', t);
    END IF;
  END LOOP;
END $$;
