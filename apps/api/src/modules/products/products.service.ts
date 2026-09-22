import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const where: any = {};
    if (query.storeId) where.storeId = query.storeId;
    if (query.status) where.status = query.status;
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        include: { images: true, category: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
    if (!p) throw new NotFoundException();
    return p;
  }

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        storeId: data.storeId,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        price: data.price,
        stock: data.stock || 0,
        description: data.description,
        categoryId: data.categoryId,
        sku: data.sku,
      },
      include: { images: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
