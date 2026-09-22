import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");
  await prisma.role.create({ data: { name: "ADMIN", displayName: "Admin", isSystem: true } }).catch(() => {});
  await prisma.role.create({ data: { name: "MERCHANT", displayName: "Merchant", isSystem: true } }).catch(() => {});
  console.log("Roles done");

  const hash = await bcrypt.hash("Admin@123456", 12);
  const adminRole = await this.prisma.role.findUnique({ where: { name: "ADMIN" } });
  let admin = await prisma.user.findUnique({ where: { email: "admin@tijara.dz" } });
  if (!admin) admin = await prisma.user.create({ data: { email: "admin@tijara.dz", passwordHash: hash, firstName: "Admin", lastName: "System" } });
  if (adminRole) await prisma.userRole.create({ data: { userId: admin.id, roleId: adminRole.id, storeId: "" } }).catch(() => {});
  console.log("Admin: admin@tijara.dz / Admin@123456");

  const plans = [
    { name: "Starter", slug: "starter", price: 0, duration: 14, maxProducts: 50, maxOrders: 200, sortOrder: 1 },
    { name: "Business", slug: "business", price: 2900, duration: 30, maxProducts: 500, maxOrders: 2000, isPopular: true, sortOrder: 2 },
    { name: "Pro", slug: "pro", price: 7900, duration: 30, sortOrder: 3 },
  ];
  for (const p of plans) await prisma.subscriptionPlan.create({ data: p }).catch(() => {});
  console.log("Plans done");

  const couriers = ["Yalidine","ZR Express","Maystro","NOEST","Eco Drive","Amine Express","Liv Express","Speed Mail","DHD","Global Express","JIBI","Atlas","Go Express","Star Livraison","Zira","Rapid","KGS","Kraim","MDP","Jaxel","Envoi","TNX","DERBAL"];
  for (const name of couriers) await prisma.courier.create({ data: { name, slug: name.toLowerCase().replace(/\s+/g, "-"), adapterKey: name.toLowerCase().replace(/\s+/g, "-") } }).catch(() => {});
  console.log(couriers.length + " couriers done");

  const wilayas = [
    { code: "01", name: "Adrar", nameAr: "Adrar", nameFr: "Adrar" }, { code: "02", name: "Chlef", nameAr: "Chlef", nameFr: "Chlef" },
    { code: "03", name: "Laghouat", nameAr: "Laghouat", nameFr: "Laghouat" }, { code: "04", name: "Oum El Bouaghi", nameAr: "Oum El Bouaghi", nameFr: "Oum El Bouaghi" },
    { code: "05", name: "Batna", nameAr: "Batna", nameFr: "Batna" }, { code: "06", name: "Bejaia", nameAr: "Bejaia", nameFr: "Bejaia" },
    { code: "07", name: "Biskra", nameAr: "Biskra", nameFr: "Biskra" }, { code: "08", name: "Bechar", nameAr: "Bechar", nameFr: "Bechar" },
    { code: "09", name: "Blida", nameAr: "Blida", nameFr: "Blida" }, { code: "10", name: "Bouira", nameAr: "Bouira", nameFr: "Bouira" },
    { code: "11", name: "Tamanrasset", nameAr: "Tamanrasset", nameFr: "Tamanrasset" }, { code: "12", name: "Tebessa", nameAr: "Tebessa", nameFr: "Tebessa" },
    { code: "13", name: "Tlemcen", nameAr: "Tlemcen", nameFr: "Tlemcen" }, { code: "14", name: "Tiaret", nameAr: "Tiaret", nameFr: "Tiaret" },
    { code: "15", name: "Tizi Ouzou", nameAr: "Tizi Ouzou", nameFr: "Tizi Ouzou" }, { code: "16", name: "Alger", nameAr: "Alger", nameFr: "Alger" },
    { code: "17", name: "Djelfa", nameAr: "Djelfa", nameFr: "Djelfa" }, { code: "18", name: "Jijel", nameAr: "Jijel", nameFr: "Jijel" },
    { code: "19", name: "Setif", nameAr: "Setif", nameFr: "Setif" }, { code: "20", name: "Saida", nameAr: "Saida", nameFr: "Saida" },
    { code: "21", name: "Skikda", nameAr: "Skikda", nameFr: "Skikda" }, { code: "22", name: "Sidi Bel Abbes", nameAr: "Sidi Bel Abbes", nameFr: "Sidi Bel Abbes" },
    { code: "23", name: "Annaba", nameAr: "Annaba", nameFr: "Annaba" }, { code: "24", name: "Guelma", nameAr: "Guelma", nameFr: "Guelma" },
    { code: "25", name: "Constantine", nameAr: "Constantine", nameFr: "Constantine" }, { code: "26", name: "Medea", nameAr: "Medea", nameFr: "Medea" },
    { code: "27", name: "Mostaganem", nameAr: "Mostaganem", nameFr: "Mostaganem" }, { code: "28", name: "Msila", nameAr: "Msila", nameFr: "Msila" },
    { code: "29", name: "Mascara", nameAr: "Mascara", nameFr: "Mascara" }, { code: "30", name: "Ouargla", nameAr: "Ouargla", nameFr: "Ouargla" },
    { code: "31", name: "Oran", nameAr: "Oran", nameFr: "Oran" }, { code: "32", name: "El Bayadh", nameAr: "El Bayadh", nameFr: "El Bayadh" },
    { code: "33", name: "Illizi", nameAr: "Illizi", nameFr: "Illizi" }, { code: "34", name: "Bordj Bou Arreridj", nameAr: "Bordj Bou Arreridj", nameFr: "Bordj Bou Arreridj" },
    { code: "35", name: "Boumerdes", nameAr: "Boumerdes", nameFr: "Boumerdes" }, { code: "36", name: "El Tarf", nameAr: "El Tarf", nameFr: "El Tarf" },
    { code: "37", name: "Tindouf", nameAr: "Tindouf", nameFr: "Tindouf" }, { code: "38", name: "Tissemsilt", nameAr: "Tissemsilt", nameFr: "Tissemsilt" },
    { code: "39", name: "El Oued", nameAr: "El Oued", nameFr: "El Oued" }, { code: "40", name: "Khenchela", nameAr: "Khenchela", nameFr: "Khenchela" },
    { code: "41", name: "Souk Ahras", nameAr: "Souk Ahras", nameFr: "Souk Ahras" }, { code: "42", name: "Tipaza", nameAr: "Tipaza", nameFr: "Tipaza" },
    { code: "43", name: "Mila", nameAr: "Mila", nameFr: "Mila" }, { code: "44", name: "Ain Defla", nameAr: "Ain Defla", nameFr: "Ain Defla" },
    { code: "45", name: "Naama", nameAr: "Naama", nameFr: "Naama" }, { code: "46", name: "Ain Temouchent", nameAr: "Ain Temouchent", nameFr: "Ain Temouchent" },
    { code: "47", name: "Ghardaia", nameAr: "Ghardaia", nameFr: "Ghardaia" }, { code: "48", name: "Relizane", nameAr: "Relizane", nameFr: "Relizane" },
    { code: "49", name: "El Mghair", nameAr: "El Mghair", nameFr: "El Mghair" }, { code: "50", name: "El Meniaa", nameAr: "El Meniaa", nameFr: "El Meniaa" },
    { code: "51", name: "Ouled Djellal", nameAr: "Ouled Djellal", nameFr: "Ouled Djellal" }, { code: "52", name: "Bordj Badji Mokhtar", nameAr: "Bordj Badji Mokhtar", nameFr: "Bordj Badji Mokhtar" },
    { code: "53", name: "Beni Abbes", nameAr: "Beni Abbes", nameFr: "Beni Abbes" }, { code: "54", name: "Timimoun", nameAr: "Timimoun", nameFr: "Timimoun" },
    { code: "55", name: "Touggourt", nameAr: "Touggourt", nameFr: "Touggourt" }, { code: "56", name: "Djanet", nameAr: "Djanet", nameFr: "Djanet" },
    { code: "57", name: "In Salah", nameAr: "In Salah", nameFr: "In Salah" }, { code: "58", name: "In Guezzam", nameAr: "In Guezzam", nameFr: "In Guezzam" },
  ];
  for (const w of wilayas) await prisma.wilaya.create({ data: w }).catch(() => {});
  console.log("58 wilayas done");

  const themes = [
    { name: "Classic", slug: "classic", config: "{\"primary\":\"#1a1a2e\",\"accent\":\"#e94560\"}" },
    { name: "Modern", slug: "modern", config: "{\"primary\":\"#0f3460\",\"accent\":\"#e94560\"}" },
    { name: "Elegant", slug: "elegant", config: "{\"primary\":\"#2d2d2d\",\"accent\":\"#c9a96e\"}" },
  ];
  for (const t of themes) await prisma.theme.create({ data: t }).catch(() => {});
  console.log("3 themes done");
  console.log("SEED COMPLETE!");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
