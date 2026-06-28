const { PrismaClient } = require("../apps/growth-platform/node_modules/@prisma/client");
const bcrypt = require("../apps/growth-platform/node_modules/bcryptjs");

async function main() {
  const prisma = new PrismaClient();
  const email = "admin@velynxia.com";
  const password = "Velynxia2026!";
  const hash = await bcrypt.hash(password, 12);

  const result = await prisma.user.updateMany({
    where: { email },
    data: {
      passwordHash: hash,
      isActive: true,
    },
  });

  console.log(`growth_admin_updated_rows=${result.count}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
