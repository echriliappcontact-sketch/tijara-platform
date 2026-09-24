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
      include: { products: { where: { status: "ACTIVE" }, include: { images: true }, orderBy: { createdAt: "desc" } }, deliverySettings: { where: { isActive: true } }, settings: true },
    });
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({
      where: { id },
      data: { name: data.name, description: data.description, phone: data.phone, whatsapp: data.whatsapp, email: data.email, logo: data.logo },
    });
  }

  async getDeliverySettings(storeId: string) {
    return this.prisma.storeDeliverySetting.findMany({ where: { storeId }, include: { wilaya: true }, orderBy: { wilaya: { code: "asc" } } });
  }

  async updateDeliverySetting(storeId: string, wilayaCode: string, data: any) {
    const existing = await this.prisma.storeDeliverySetting.findFirst({ where: { storeId, wilayaCode } });
    if (existing) {
      return this.prisma.storeDeliverySetting.update({
        where: { id: existing.id },
        data: { homePrice: data.homePrice, stopDeskPrice: data.stopDeskPrice, isActive: data.isActive, estimatedDays: data.estimatedDays },
      });
    }
    return this.prisma.storeDeliverySetting.create({
      data: { storeId, wilayaCode, homePrice: data.homePrice, stopDeskPrice: data.stopDeskPrice, isActive: data.isActive ?? true, estimatedDays: data.estimatedDays || 3 },
    });
  }

  async bulkUpdateDelivery(storeId: string, settings: any[]) {
    const results = [];
    for (const s of settings) {
      const existing = await this.prisma.storeDeliverySetting.findFirst({ where: { storeId, wilayaCode: s.wilayaCode } });
      if (existing) {
        results.push(await this.prisma.storeDeliverySetting.update({
          where: { id: existing.id },
          data: { homePrice: s.homePrice, stopDeskPrice: s.stopDeskPrice, isActive: s.isActive, estimatedDays: s.estimatedDays },
        }));
      } else {
        results.push(await this.prisma.storeDeliverySetting.create({
          data: { storeId, wilayaCode: s.wilayaCode, homePrice: s.homePrice, stopDeskPrice: s.stopDeskPrice, isActive: s.isActive ?? true, estimatedDays: s.estimatedDays || 3 },
        }));
      }
    }
    return results;
  }

  async delete(id: string) {
    await this.prisma.store.delete({ where: { id } });
    return { message: "Store deleted" };
  }
}