const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding plans...");

  await prisma.subscriptionPlan.deleteMany();

  await prisma.subscriptionPlan.create({
    data: {
      name: "Starter",
      slug: "starter",
      description: "For new merchants starting out",
      price: 2000,
      duration: 30,
      maxProducts: 50,
      maxOrders: 200,
      maxStaff: 1,
      features: JSON.stringify(["50 Products", "200 Orders/month", "1 Staff", "All Wilayas", "23 Couriers", "COD"]),
      isPopular: false,
      sortOrder: 1,
    },
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: "Business",
      slug: "business",
      description: "For growing businesses",
      price: 5000,
      duration: 30,
      maxProducts: 500,
      maxOrders: 2000,
      maxStaff: 3,
      features: JSON.stringify(["500 Products", "2000 Orders/month", "3 Staff", "All Wilayas", "23 Couriers", "COD", "Analytics"]),
      isPopular: true,
      sortOrder: 2,
    },
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: "Pro",
      slug: "pro",
      description: "For established businesses",
      price: 10000,
      duration: 30,
      maxProducts: null,
      maxOrders: null,
      maxStaff: 10,
      features: JSON.stringify(["Unlimited Products", "Unlimited Orders", "10 Staff", "All Wilayas", "23 Couriers", "COD", "Analytics", "Priority Support"]),
      isPopular: false,
      sortOrder: 3,
    },
  });

  console.log("3 plans created!");

  await prisma.role.create({ data: { name: "ADMIN", displayName: "Admin", isSystem: true } }).catch(() => {});
  await prisma.role.create({ data: { name: "MERCHANT", displayName: "Merchant", isSystem: true } }).catch(() => {});

  const bcrypt = require("bcrypt");
  const hash = await bcrypt.hash("Admin@123456", 12);
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  let admin = await prisma.user.findUnique({ where: { email: "admin@tijara.dz" } });
  if (!admin) {
    admin = await prisma.user.create({
      data: { email: "admin@tijara.dz", passwordHash: hash, firstName: "Admin", lastName: "System" },
    });
  }
  if (adminRole) {
    await prisma.userRole.create({
      data: { userId: admin.id, roleId: adminRole.id, storeId: "" },
    }).catch(() => {});
  }
  console.log("Admin: admin@tijara.dz / Admin@123456");

  console.log("SEED COMPLETE!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());