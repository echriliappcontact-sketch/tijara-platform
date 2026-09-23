import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.store.findMany({ include: { owner: { select: { id: true, email: true, firstName: true } } }, orderBy: { createdAt: "desc" } });
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

  async update(id: string, data: any) {
    return this.prisma.store.update({ where: { id }, data: { name: data.name, description: data.description, phone: data.phone, whatsapp: data.whatsapp, email: data.email, logo: data.logo } });
  }

  async delete(id: string) {
    await this.prisma.store.delete({ where: { id } });
    return { message: "Store deleted" };
  }
}