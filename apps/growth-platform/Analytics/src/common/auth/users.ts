import bcrypt from "bcryptjs";
import { prisma } from "@/common/services";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  features: string[];
}

const ADMIN_EMAIL = "admin@velynxia.com";

type UserAuthRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  passwordHash: string | null;
  isActive: boolean | null;
};

export async function seedAdmin(): Promise<void> {
  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id::text AS id
    FROM users
    WHERE LOWER(email) = LOWER(${ADMIN_EMAIL})
    LIMIT 1
  `;
  if (existing.length > 0) return;

  const passwordHash = await bcrypt.hash("Velynxia2024!", 12);
  await prisma.$executeRaw`
    INSERT INTO users (name, email, "passwordHash", role)
    VALUES ('Admin', ${ADMIN_EMAIL}, ${passwordHash}, 'ADMIN'::"UserRole")
    ON CONFLICT (email) DO NOTHING
  `;
}

export async function bootstrapPlatform(): Promise<void> {
  await seedAdmin();
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const rows = await prisma.$queryRaw<UserAuthRow[]>`
    SELECT
      id::text AS id,
      name,
      email,
      role::text AS role,
      "passwordHash",
      COALESCE("isActive", true) AS "isActive"
    FROM users
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `;
  const user = rows[0];
  if (!user || !user.passwordHash || !user.isActive) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    features: ["ANALYTICS"],
  };
}
