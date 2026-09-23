import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId?: string) {
    const where = storeId ? { storeId } : {};
    return this.prisma.product.findMany({ where, include: { store: { select: { id: true, name: true } }, category: true, images: true }, orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { store: true, category: true, images: true, variants: true } });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    return this.prisma.product.create({
      data: {
        storeId: data.storeId, categoryId: data.categoryId || null, name: data.name, slug,
        description: data.description || null, price: data.price, compareAtPrice: data.compareAtPrice || null,
        sku: data.sku || null, stock: data.stock || 0, status: data.status || "DRAFT",
        isFeatured: data.isFeatured || false, tags: data.tags ? JSON.stringify(data.tags) : "[]",
      },
    });
  }

  async update(id: string, data: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    return this.prisma.product.update({ where: { id }, data: { name: data.name, description: data.description, price: data.price, compareAtPrice: data.compareAtPrice, sku: data.sku, stock: data.stock, status: data.status, isFeatured: data.isFeatured, categoryId: data.categoryId } });
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: "Product deleted" };
  }
}