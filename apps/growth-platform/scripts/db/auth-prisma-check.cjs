const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const u = await prisma.user.findUnique({ where: { email: "admin@velynxia.com" } });
  console.log("user", u);
  if (u) {
    const ok = await bcrypt.compare("Velynxia2024!", u.passwordHash || "");
    console.log("passwordMatch", ok);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
