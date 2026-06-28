import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type StoredUserRole = "ADMIN" | "USER";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: StoredUserRole;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserStorePayload = {
  users: StoredUser[];
};

const DATA_DIR = join(process.cwd(), ".data");
const USERS_FILE = join(DATA_DIR, "auth-users.json");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@velynxia.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Velynxia@2024!";
const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? "11111111-1111-1111-1111-111111111111";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [algo, saltHex, hashHex] = passwordHash.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

async function writeStore(payload: UserStorePayload) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

async function readStore() {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as UserStorePayload;
    if (!Array.isArray(parsed.users)) {
      return { users: [] } as UserStorePayload;
    }
    return parsed;
  } catch {
    return { users: [] } as UserStorePayload;
  }
}

async function ensureSeededStore() {
  const store = await readStore();
  const adminExists = store.users.some((user) => normalizeEmail(user.email) === ADMIN_EMAIL);
  if (adminExists) {
    return store;
  }

  const now = new Date().toISOString();
  const adminUser: StoredUser = {
    id: ADMIN_USER_ID,
    email: ADMIN_EMAIL,
    name: "Admin",
    role: "ADMIN",
    passwordHash: hashPassword(ADMIN_PASSWORD),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const nextStore = {
    users: [adminUser, ...store.users],
  };
  await writeStore(nextStore);
  return nextStore;
}

export async function verifyUserCredentials(email: string, password: string) {
  const store = await ensureSeededStore();
  const normalizedEmail = normalizeEmail(email);
  const user = store.users.find((item) => normalizeEmail(item.email) === normalizedEmail && item.isActive);
  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function createStoredUser(input: {
  email: string;
  password: string;
  name?: string;
  role?: StoredUserRole;
}) {
  const store = await ensureSeededStore();
  const email = normalizeEmail(input.email);

  if (!email) {
    throw new Error("Email is required.");
  }

  if (store.users.some((item) => normalizeEmail(item.email) === email)) {
    throw new Error("User with this email already exists.");
  }

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomUUID(),
    email,
    name: input.name?.trim() || email,
    role: input.role ?? "USER",
    passwordHash: hashPassword(input.password),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const next = { users: [...store.users, user] };
  await writeStore(next);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function updateStoredUserPassword(input: { email: string; newPassword: string }) {
  const store = await ensureSeededStore();
  const email = normalizeEmail(input.email);
  const index = store.users.findIndex((item) => normalizeEmail(item.email) === email);
  if (index < 0) {
    throw new Error("User not found.");
  }

  const existing = store.users[index];
  const updated: StoredUser = {
    ...existing,
    passwordHash: hashPassword(input.newPassword),
    updatedAt: new Date().toISOString(),
  };

  const users = [...store.users];
  users[index] = updated;
  await writeStore({ users });

  return {
    id: updated.id,
    email: updated.email,
    role: updated.role,
  };
}
