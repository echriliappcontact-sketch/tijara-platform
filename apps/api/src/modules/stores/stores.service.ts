import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.store.findMany({
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } }, _count: { select: { products: true, orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } }, settings: true, _count: { select: { products: true, orders: true, customers: true } } },
    });
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.store.findFirst({ where: { ownerId }, include: { settings: true, _count: { select: { products: true, orders: true } } } });
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        products: { where: { status: "ACTIVE" }, include: { images: { orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" } },
        deliverySettings: { where: { isActive: true } },
        settings: true,
      },
    });
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.logo !== undefined && { logo: data.logo }),
      },
    });
  }

  async updateSettings(storeId: string, data: any) {
    const existing = await this.prisma.storeSettings.findUnique({ where: { storeId } });
    const s: any = {};
    if (data.metaTitle !== undefined) s.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) s.metaDescription = data.metaDescription;
    if (data.enableCod !== undefined) s.enableCod = data.enableCod;
    if (data.enableHomeDelivery !== undefined) s.enableHomeDelivery = data.enableHomeDelivery;
    if (data.enableStopDesk !== undefined) s.enableStopDesk = data.enableStopDesk;
    if (existing) return this.prisma.storeSettings.update({ where: { storeId }, data: s });
    return this.prisma.storeSettings.create({ data: { storeId, ...s } });
  }

  async getDeliverySettings(storeId: string) {
    return this.prisma.storeDeliverySetting.findMany({
      where: { storeId },
      include: { wilaya: true },
      orderBy: { wilayaCode: "asc" },
    });
  }

  async updateDeliverySetting(storeId: string, wilayaCode: string, data: any) {
    const existing = await this.prisma.storeDeliverySetting.findFirst({ where: { storeId, wilayaCode } });
    const d: any = {};
    if (data.homePrice !== undefined) d.homePrice = Number(data.homePrice);
    if (data.stopDeskPrice !== undefined) d.stopDeskPrice = Number(data.stopDeskPrice);
    if (data.isActive !== undefined) d.isActive = data.isActive;
    if (data.estimatedDays !== undefined) d.estimatedDays = Number(data.estimatedDays);
    if (existing) return this.prisma.storeDeliverySetting.update({ where: { id: existing.id }, data: d });
    return this.prisma.storeDeliverySetting.create({
      data: { storeId, wilayaCode, homePrice: Number(data.homePrice) || 0, stopDeskPrice: Number(data.stopDeskPrice) || 0, isActive: data.isActive ?? true, estimatedDays: Number(data.estimatedDays) || 3 },
    });
  }

  async delete(id: string) {
    await this.prisma.store.delete({ where: { id } });
    return { message: "Store deleted" };
  }
}