"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding...');
    await prisma.role.create({ data: { name: 'ADMIN', displayName: 'Admin', isSystem: true } }).catch(() => { });
    await prisma.role.create({ data: { name: 'MERCHANT', displayName: 'Merchant', isSystem: true } }).catch(() => { });
    console.log('Roles done');
    const hash = await bcrypt.hash('Admin@123456', 12);
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    let admin = await prisma.user.findUnique({ where: { email: 'admin@tijara.dz' } });
    if (!admin) {
        admin = await prisma.user.create({
            data: { email: 'admin@tijara.dz', passwordHash: hash, firstName: 'Admin', lastName: 'System', isActive: true },
        });
    }
    if (adminRole) {
        await prisma.userRole.create({
            data: { userId: admin.id, roleId: adminRole.id, storeId: '' },
        }).catch(() => { });
    }
    console.log('Admin: admin@tijara.dz / Admin@123456');
    const plans = [
        { name: 'Starter', slug: 'starter', price: 0, duration: 14, maxProducts: 50, maxOrders: 200, isActive: true, sortOrder: 1 },
        { name: 'Business', slug: 'business', price: 2900, duration: 30, maxProducts: 500, maxOrders: 2000, maxStaff: 3, isPopular: true, isActive: true, sortOrder: 2 },
        { name: 'Pro', slug: 'pro', price: 7900, duration: 30, maxStaff: 10, isActive: true, sortOrder: 3 },
    ];
    for (const p of plans) {
        await prisma.subscriptionPlan.create({ data: p }).catch(() => { });
    }
    console.log('Plans done');
    const couriers = [
        { name: 'Yalidine', slug: 'yalidine', adapterKey: 'yalidine' },
        { name: 'ZR Express', slug: 'zr-express', adapterKey: 'zr-express' },
        { name: 'Maystro', slug: 'maystro', adapterKey: 'maystro' },
        { name: 'NOEST', slug: 'noest', adapterKey: 'noest' },
        { name: 'Eco Drive', slug: 'eco-drive', adapterKey: 'eco-drive' },
        { name: 'Amine Express', slug: 'amine-express', adapterKey: 'amine-express' },
        { name: 'Liv Express', slug: 'liv-express', adapterKey: 'liv-express' },
        { name: 'Speed Mail', slug: 'speed-mail', adapterKey: 'speed-mail' },
        { name: 'DHD', slug: 'dhd', adapterKey: 'dhd' },
        { name: 'Global Express', slug: 'global-express', adapterKey: 'global-express' },
        { name: 'JIBI', slug: 'jibi', adapterKey: 'jibi' },
        { name: 'Atlas', slug: 'atlas', adapterKey: 'atlas' },
        { name: 'Go Express', slug: 'go-express', adapterKey: 'go-express' },
        { name: 'Star Livraison', slug: 'star-livraison', adapterKey: 'star-livraison' },
        { name: 'Zira', slug: 'zira', adapterKey: 'zira' },
        { name: 'Rapid', slug: 'rapid', adapterKey: 'rapid' },
        { name: 'KGS', slug: 'kgs', adapterKey: 'kgs' },
        { name: 'Kraim', slug: 'kraim', adapterKey: 'kraim' },
        { name: 'MDP', slug: 'mdp', adapterKey: 'mdp' },
        { name: 'Jaxel', slug: 'jaxel', adapterKey: 'jaxel' },
        { name: 'Envoi', slug: 'envoi', adapterKey: 'envoi' },
        { name: 'TNX', slug: 'tnx', adapterKey: 'tnx' },
        { name: 'DERBAL', slug: 'derbal', adapterKey: 'derbal' },
    ];
    for (const c of couriers) {
        await prisma.courier.create({ data: { ...c, supportsHomeDelivery: true, supportsStopDesk: true, supportsCod: true, supportsTracking: true, isActive: true } }).catch(() => { });
    }
    console.log(couriers.length + ' couriers done');
    const wilayas = [
        { code: '01', name: 'Adrar', nameAr: '\u0623\u062f\u0631\u0627\u0631', nameFr: 'Adrar' },
        { code: '02', name: 'Chlef', nameAr: '\u0627\u0644\u0634\u0644\u0641', nameFr: 'Chlef' },
        { code: '03', name: 'Laghouat', nameAr: '\u0627\u0644\u0623\u063a\u0648\u0627\u0637', nameFr: 'Laghouat' },
        { code: '04', name: 'Oum El Bouaghi', nameAr: '\u0623\u0645 \u0627\u0644\u0628\u0648\u0627\u0642\u064a', nameFr: 'Oum El Bouaghi' },
        { code: '05', name: 'Batna', nameAr: '\u0628\u0627\u062a\u0646\u0629', nameFr: 'Batna' },
        { code: '06', name: 'Bejaia', nameAr: '\u0628\u062c\u0627\u064a\u0629', nameFr: 'Bejaia' },
        { code: '07', name: 'Biskra', nameAr: '\u0628\u0633\u0643\u063 name: ', Bechar, ', nameAr: ': \u0628\u0634\u0627\u0631, ', nameFr: ': Bechar, ' },: { code: '09', name: 'Blida', nameAr: '\u0627\u0644\u0628\u0644\u064a\u062f\u0629', nameFr: 'Blida' }, },
        { code: '10', name: 'Bouira', nameAr: '\u0627\u0644\u0628\u0648\u064a\u0631\u0629', nameFr: 'Bouira' },
        { code: '11', name: 'Tamanrasset', nameAr: '\u062a\u0645\u0646\u0631\u0633\u062a', nameFr: 'Tamanrasset' },
        { code: '12', name: 'Tebessa', nameAr: '\u062a\u0628\u0633\u0629', nameFr: 'Tebessa' },
        { code: '13', name: 'Tlemcen', nameAr: '\u062a\u0644\u0645\u0633\u0627\u0646', nameFr: 'Tlemcen' },
        { code: '14', name: 'Tiaret', nameAr: 1, \u0629, ', nameFr: ': Biskra, ' },: { code: '08', '\u062a\u064a\u0627\u0631\u062a': , nameFr: 'Tiaret' }, },
        { code: '15', name: 'Tizi Ouzou', nameAr: '\u062a\u064a\u0632\u064a \u0648\u0632\u0648', nameFr: 'Tizi Ouzou' },
        { code: '16', name: 'Alger', nameAr: '\u0627\u0644\u062c\u0632\u0627\u0626\u0631', nameFr: 'Alger' },
        { code: '17', name: 'Djelfa', nameAr: '\u0627\u0644\u062c\u0644\u0641\u0629', nameFr: 'Djelfa' },
        { code: '18', name: 'Jijel', nameAr: '\u062c\u064a\u062c\u0644', nameFr: 'Jijel' },
        { code: '19', name: 'Setif', nameAr: '\u0633\u0637\u064a\u0641', nameFr: 'Setif' },
        { code: '20', name: 'Saida', nameAr: '\u0633\u0639\u064a\u062f\u0629', nameFr: 'Saida' },
        { code: '21', name: 'Skikda', nameAr: '\u0633\u0643\u064a\u0643\u062f\u0629', nameFr: 'Skikda' },
        { code: '22', name: 'Sidi Bel Abbes', nameAr: '\u0633\u064a\u062f\u064a \u0628\u0644\u0639\u0628\u0627\u0633', nameFr: 'Sidi Bel Abbes' },
        { code: '23', name: 'Annaba', nameAr: '\u0639\u0646\u0627\u0628\u0629', nameFr: 'Annaba' },
        { code: '24', name: 'Guelma', nameAr: '\u0642\u0627\u0644\u0645\u0629', nameFr: 'Guelma' },
        { code: '25', name: 'Constantine', nameAr: '\u0642\u0633\u0646\u0637\u064a\u0646\u0629', nameFr: 'Constantine' },
        { code: '26', name: 'Medea', nameAr: '\u0627\u0644\u0645\u062f\u064a\u0629', nameFr: 'Medea' },
        { code: '27', name: 'Mostaganem', nameAr: '\u0645\u0633\u062a\u063a\u0627\u0646\u0645', nameFr: 'Mostaganem' },
        { code: '28', name: 'Msila', nameAr: '\u0627\u0644\u0645\u0633\u064a\u0644\u0629', nameFr: 'Msila' },
        { code: '29', name: 'Mascara', nameAr: '\u0645\u0639\u0633\u0643\u0631', nameFr: 'Mascara' },
        { code: '30', name: 'Ouargla', nameAr: '\u0648\u0631\u0642\u0644\u0629', nameFr: 'Ouargla' },
        { code: '31', name: 'Oran', nameAr: '\u0648\u0647\u0631\u0627\u0646', nameFr: 'Oran' },
        { code: '32', name: 'El Bayadh', nameAr: '\u0627\u0644\u0628\u064a\u0636', nameFr: 'El Bayadh' },
        { code: '33', name: 'Illizi', nameAr: '\u0625\u0644\u064a\u0632\u064a', nameFr: 'Illizi' },
        { code: '34', name: 'Bordj Bou Arreridj', nameAr: '\u0628\u0631\u062c \u0628\u0648\u0639\u0631\u064a\u0631\u064a\u062c', nameFr: 'Bordj Bou Arreridj' },
        { code: '35', name: 'Boumerdes', nameAr: '\u0628\u0648\u0645\u0631\u062f\u0627\u0633', nameFr: 'Boumerdes' },
        { code: '36', name: 'El Tarf', nameAr: '\u0627\u0644\u0637\u0627\u0631\u0641', nameFr: 'El Tarf' },
        { code: '37', name: 'Tindouf', nameAr: '\u062a\u0646\u062f\u0648\u0641', nameFr: 'Tindouf' },
        { code: '38', name: 'Tissemsilt', nameAr: '\u062a\u0633\u064a\u0645\u0633\u064a\u0644\u062a', nameFr: 'Tissemsilt' },
        { code: '39', name: 'El Oued', nameAr: '\u0627\u0644\u0648\u0627\u062f\u064a', nameFr: 'El Oued' },
        { code: '40', name: 'Khenchela', nameAr: '\u062e\u0646\u0634\u0644\u0629', nameFr: 'Khenchela' },
        { code: '41', name: 'Souk Ahras', nameAr: '\u0633\u0648\u0642 \u0623\u0647\u0631\u0627\u0633', nameFr: 'Souk Ahras' },
        { code: '42', name: 'Tipaza', nameAr: '\u062a\u064a\u0628\u0627\u0632\u0629', nameFr: 'Tipaza' },
        { code: '43', name: 'Mila', nameAr: '\u0645\u064a\u0644\u0629', nameFr: 'Mila' },
        { code: '44', name: 'Ain Defla', nameAr: '\u0639\u064a\u0646 \u0627\u0644\u062f\u0641\u0644\u0649', nameFr: 'Ain Defla' },
        { code: '45', name: 'Naama', nameAr: '\u0627\u0644\u0646\u0639\u0627\u0645\u0629', nameFr: 'Naama' },
        { code: '46', name: 'Ain Temouchent', nameAr: '\u0639\u064a\u0646 \u062a\u0645\u0648\u0634\u0646\u062a', nameFr: 'Ain Temouchent' },
        { code: '47', name: 'Ghardaia', nameAr: '\u063a\u0631\u062f\u0627\u064a\u0629', nameFr: 'Ghardaia' },
        { code: '48', name: 'Relizane', nameAr: '\u063a\u0644\u064a\u0632\u0627\u0646', nameFr: 'Relizane' },
        { code: '49', name: 'El Mghair', nameAr: '\u0627\u0644\u0645\u063a\u064a\u0631', nameFr: 'El Mghair' },
        { code: '50', name: 'El Meniaa', nameAr: '\u0627\u0644\u0645\u0646\u064a\u0639\u0629', nameFr: 'El Meniaa' },
        { code: '51', name: 'Ouled Djellal', nameAr: '\u0623\u0648\u0644\u0627\u062f \u062c\u0644\u0627\u0644', nameFr: 'Ouled Djellal' },
        { code: '52', name: 'Bordj Badji Mokhtar', nameAr: '\u0628\u0631\u062c \u0628\u0627\u062c\u064a \u0645\u062e\u062a\u0627\u0631', nameFr: 'Bordj Badji Mokhtar' },
        { code: '53', name: 'Beni Abbes', nameAr: '\u0628\u0646\u064a \u0639\u0628\u0627\u0633', nameFr: 'Beni Abbes' },
        { code: '54', name: 'Timimoun', nameAr: '\u062a\u064a\u0645\u064a\u0645\u0648\u0646', nameFr: 'Timimoun' },
        { code: '55', name: 'Touggourt', nameAr: '\u062a\u0648\u0642\u0631\u062a', nameFr: 'Touggourt' },
        { code: '56', name: 'Djanet', nameAr: '\u062c\u0627\u0646\u062a', nameFr: 'Djanet' },
        { code: '57', name: 'In Salah', nameAr: '\u0639\u064a\u0646 \u0635\u0627\u0644\u062d', nameFr: 'In Salah' },
        { code: '58', name: 'In Guezzam', nameAr: '\u0639\u064a\u0646 \u0642\u0632\u0627\u0645', nameFr: 'In Guezzam' },
    ];
    for (const w of wilayas) {
        await prisma.wilaya.create({ data: w }).catch(() => { });
    }
    console.log('58 wilayas done');
    const themes = [
        { name: 'Classic', slug: 'classic', config: '{"primaryColor":"#1a1a2e","secondaryColor":"#e94560"}' },
        { name: 'Modern', slug: 'modern', config: '{"primaryColor":"#0f3460","secondaryColor":"#e94560"}' },
        { name: 'Elegant', slug: 'elegant', config: '{"primaryColor":"#2d2d2d","secondaryColor":"#c9a96e"}' },
        { name: 'Nature', slug: 'nature', config: '{"primaryColor":"#2d5016","secondaryColor":"#f59e0b"}' },
        { name: 'Tech', slug: 'tech', config: '{"primaryColor":"#1e293b","secondaryColor":"#3b82f6"}' },
        { name: 'Vibrant', slug: 'vibrant', config: '{"primaryColor":"#7c3aed","secondaryColor":"#f59e0b"}' },
    ];
    for (const t of themes) {
        await prisma.theme.create({ data: t }).catch(() => { });
    }
    console.log('6 themes done');
    console.log('Seed complete!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=index.js.map