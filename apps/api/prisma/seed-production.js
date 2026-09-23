const { PrismaClient } = require("@prisma/client");

process.env.DATABASE_URL = "postgresql://tijara_user:wuS8riWA1gW466b7hJcsRq6N5npj5aFa@dpg-dapgictbedkc738q42h0-a.frankfurt-postgres.render.com/tijara";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding production database...");

  await prisma.subscriptionPlan.deleteMany();
  console.log("Old plans deleted");

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
  console.log("Starter created");

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
  console.log("Business created");

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
  console.log("Pro created");

  // Seed roles
  await prisma.role.create({ data: { name: "ADMIN", displayName: "Admin", isSystem: true } }).catch(() => {});
  await prisma.role.create({ data: { name: "MERCHANT", displayName: "Merchant", isSystem: true } }).catch(() => {});
  console.log("Roles created");

  // Seed admin user
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
  console.log("Admin created: admin@tijara.dz / Admin@123456");

  // Seed 58 wilayas
  const wilayas = [
    { code: "01", name: "Adrar", nameAr: "أدرار", nameFr: "Adrar" },
    { code: "02", name: "Chlef", nameAr: "الشلف", nameFr: "Chlef" },
    { code: "03", name: "Laghouat", nameAr: "الأغواط", nameFr: "Laghouat" },
    { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi" },
    { code: "05", name: "Batna", nameAr: "باتنة", nameFr: "Batna" },
    { code: "06", name: "Bejaia", nameAr: "بجاية", nameFr: "Bejaia" },
    { code: "07", name: "Biskra", nameAr: "بسكرة", nameFr: "Biskra" },
    { code: "08", name: "Bechar", nameAr: "بشار", nameFr: "Bechar" },
    { code: "09", name: "Blida", nameAr: "البليدة", nameFr: "Blida" },
    { code: "10", name: "Bouira", nameAr: "البويرة", nameFr: "Bouira" },
    { code: "11", name: "Tamanrasset", nameAr: "تمنراست", nameFr: "Tamanrasset" },
    { code: "12", name: "Tebessa", nameAr: "تبسة", nameFr: "Tebessa" },
    { code: "13", name: "Tlemcen", nameAr: "تلمسان", nameFr: "Tlemcen" },
    { code: "14", name: "Tiaret", nameAr: "تيارت", nameFr: "Tiaret" },
    { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou" },
    { code: "16", name: "Algiers", nameAr: "الجزائر", nameFr: "Alger" },
    { code: "17", name: "Djelfa", nameAr: "الجلفة", nameFr: "Djelfa" },
    { code: "18", name: "Jijel", nameAr: "جيجل", nameFr: "Jijel" },
    { code: "19", name: "Setif", nameAr: "سطيف", nameFr: "Setif" },
    { code: "20", name: "Saida", nameAr: "سعيدة", nameFr: "Saida" },
    { code: "21", name: "Skikda", nameAr: "سكيكدة", nameFr: "Skikda" },
    { code: "22", name: "Sidi Bel Abbes", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbes" },
    { code: "23", name: "Annaba", nameAr: "عنابة", nameFr: "Annaba" },
    { code: "24", name: "Guelma", nameAr: "قالمة", nameFr: "Guelma" },
    { code: "25", name: "Constantine", nameAr: "قسنطينة", nameFr: "Constantine" },
    { code: "26", name: "Medea", nameAr: "المدية", nameFr: "Medea" },
    { code: "27", name: "Mostaganem", nameAr: "مستغانم", nameFr: "Mostaganem" },
    { code: "28", name: "Msila", nameAr: "المسيلة", nameFr: "Msila" },
    { code: "29", name: "Mascara", nameAr: "معسكر", nameFr: "Mascara" },
    { code: "30", name: "Ouargla", nameAr: "ورقلة", nameFr: "Ouargla" },
    { code: "31", name: "Oran", nameAr: "وهران", nameFr: "Oran" },
    { code: "32", name: "El Bayadh", nameAr: "البيض", nameFr: "El Bayadh" },
    { code: "33", name: "Illizi", nameAr: "إليزي", nameFr: "Illizi" },
    { code: "34", name: "Bordj Bou Arreridj", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arreridj" },
    { code: "35", name: "Boumerdes", nameAr: "بومرداس", nameFr: "Boumerdes" },
    { code: "36", name: "El Tarf", nameAr: "الطارف", nameFr: "El Tarf" },
    { code: "37", name: "Tindouf", nameAr: "تندوف", nameFr: "Tindouf" },
    { code: "38", name: "Tissemsilt", nameAr: "تسيمسيلت", nameFr: "Tissemsilt" },
    { code: "39", name: "El Oued", nameAr: "الوادي", nameFr: "El Oued" },
    { code: "40", name: "Khenchela", nameAr: "خنشلة", nameFr: "Khenchela" },
    { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس", nameFr: "Souk Ahras" },
    { code: "42", name: "Tipaza", nameAr: "تيبازة", nameFr: "Tipaza" },
    { code: "43", name: "Mila", nameAr: "ميلة", nameFr: "Mila" },
    { code: "44", name: "Ain Defla", nameAr: "عين الدفلى", nameFr: "Ain Defla" },
    { code: "45", name: "Naama", nameAr: "النعامة", nameFr: "Naama" },
    { code: "46", name: "Ain Temouchent", nameAr: "عين تموشنت", nameFr: "Ain Temouchent" },
    { code: "47", name: "Ghardaia", nameAr: "غرداية", nameFr: "Ghardaia" },
    { code: "48", name: "Relizane", nameAr: "غليزان", nameFr: "Relizane" },
    { code: "49", name: "El Mghair", nameAr: "المغير", nameFr: "El Mghair" },
    { code: "50", name: "El Meniaa", nameAr: "المنيعة", nameFr: "El Meniaa" },
    { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال", nameFr: "Ouled Djellal" },
    { code: "52", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar" },
    { code: "53", name: "Beni Abbes", nameAr: "بني عباس", nameFr: "Beni Abbes" },
    { code: "54", name: "Timimoun", nameAr: "تيميمون", nameFr: "Timimoun" },
    { code: "55", name: "Touggourt", nameAr: "توقرت", nameFr: "Touggourt" },
    { code: "56", name: "Djanet", nameAr: "جانت", nameFr: "Djanet" },
    { code: "57", name: "In Salah", nameAr: "عين صالح", nameFr: "In Salah" },
    { code: "58", name: "In Guezzam", nameAr: "عين قزام", nameFr: "In Guezzam" },
  ];

  for (const w of wilayas) {
    await prisma.wilaya.create({ data: w }).catch(() => {});
  }
  console.log("58 wilayas created");

  // Seed couriers
  const couriers = [
    { name: "Yalidine", slug: "yalidine" },
    { name: "ZR Express", slug: "zr-express" },
    { name: "Maystro Livraison", slug: "maystro" },
    { name: "NOEST Express", slug: "noest" },
    { name: "Ecotrack", slug: "ecotrack" },
    { name: "JRS Express", slug: "jrs" },
    { name: "HMD Express", slug: "hmd" },
    { name: "TCC Livraison", slug: "tcc" },
    { name: "GLS Express", slug: "gls" },
    { name: "COLIS EXPRÈS", slug: "colis-express" },
  ];

  for (const c of couriers) {
    await prisma.courier.create({ data: c }).catch(() => {});
  }
  console.log("10 couriers created");

  console.log("PRODUCTION SEED COMPLETE!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());