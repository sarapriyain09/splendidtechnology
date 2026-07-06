BEGIN;

INSERT INTO licenses (id, name, "sortOrder", "createdAt", "updatedAt", uuid)
SELECT 'emergency-enterprise-license', 'Enterprise', 999, now(), now(), gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM licenses);

WITH upsert_user AS (
  INSERT INTO users (
    id_text_legacy,
    uuid,
    email,
    name,
    role,
    "passwordHash",
    "isActive",
    "createdAt",
    "updatedAt",
    created_at,
    updated_at,
    is_deleted,
    version
  )
  VALUES (
    'emergency-admin-text-id',
    gen_random_uuid(),
    'admin@velynxia.com',
    'Platform Admin',
    'ADMIN'::"UserRole",
    '$2b$10$CiNhUrMF2loDc1tQ2Q9AIuQ5HgNH4Xczb3XcM.xOK.iqw5kItlc02',
    true,
    now(),
    now(),
    now(),
    now(),
    false,
    1
  )
  ON CONFLICT (email) DO UPDATE
  SET
    role = EXCLUDED.role,
    "passwordHash" = EXCLUDED."passwordHash",
    "isActive" = true,
    "updatedAt" = now(),
    updated_at = now(),
    is_deleted = false
  RETURNING id, COALESCE(id_text_legacy, 'emergency-admin-text-id') AS legacy_id
)
INSERT INTO user_licenses ("userId", "userId_text_legacy", "licenseId", "assignedAt")
SELECT u.id, u.legacy_id, l.id, now()
FROM upsert_user u
CROSS JOIN licenses l
WHERE NOT EXISTS (
  SELECT 1
  FROM user_licenses ul
  WHERE ul."userId" = u.id
    AND ul."licenseId" = l.id
);

COMMIT;

SELECT COUNT(*) AS users_count FROM users;
SELECT COUNT(*) AS licenses_count FROM licenses;
SELECT COUNT(*) AS user_licenses_count FROM user_licenses;
SELECT id, email, role, "isActive" FROM users ORDER BY id DESC LIMIT 10;
