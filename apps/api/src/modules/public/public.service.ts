import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}
  async getStoreBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({ where: { slug, isPublished: true }, include: { categories: { where: { isActive: true } }, products: { where: { status: "PUBLISHED" }, include: { images: true } }, settings: true } });
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }
  async getWilayas() { return this.prisma.wilaya.findMany({ where: { isActive: true }, orderBy: { code: "asc" } }); }
}
