const fs = require("node:fs");
const path = require("node:path");
const { randomBytes, scryptSync } = require("node:crypto");

const file = path.join(process.cwd(), ".data", "auth-users.json");
const email = "admin@velynxia.com";
const password = "Velynxia2026!";

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;

let payload = { users: [] };
try {
  payload = JSON.parse(fs.readFileSync(file, "utf8"));
} catch {
  payload = { users: [] };
}

if (!Array.isArray(payload.users)) {
  payload.users = [];
}

const idx = payload.users.findIndex((user) => String(user.email ?? "").toLowerCase() === email);
if (idx >= 0) {
  payload.users[idx].passwordHash = passwordHash;
  payload.users[idx].isActive = true;
  payload.users[idx].updatedAt = new Date().toISOString();
} else {
  const now = new Date().toISOString();
  payload.users.unshift({
    id: "11111111-1111-1111-1111-111111111111",
    email,
    name: "Admin",
    role: "ADMIN",
    passwordHash,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
}

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(payload, null, 2));
console.log("aimedia_admin_reset_done=1");
