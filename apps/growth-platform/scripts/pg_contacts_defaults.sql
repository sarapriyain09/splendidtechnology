SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='contacts'
ORDER BY ordinal_position;
