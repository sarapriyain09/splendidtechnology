UPDATE users
SET "passwordHash" = '$2b$12$QjcdjveqmttHWfb6.6TOOu..UR.hWwycMa7xhg4UnXNAkvKM03.Ya',
    "isActive" = true,
    "updatedAt" = now(),
    updated_at = now()
WHERE email = 'admin@velynxia.com';

SELECT COUNT(*) AS active_admin_rows
FROM users
WHERE email='admin@velynxia.com' AND "isActive" = true;
