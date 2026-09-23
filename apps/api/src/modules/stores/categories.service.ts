import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findByStore(storeId: string) {
    return this.prisma.category.findMany({ where: { storeId, isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return this.prisma.category.create({ data: { storeId: data.storeId, name: data.name, slug, parentId: data.parentId || null, image: data.image || null, sortOrder: data.sortOrder || 0 } });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { message: "Category deleted" };
  }
}