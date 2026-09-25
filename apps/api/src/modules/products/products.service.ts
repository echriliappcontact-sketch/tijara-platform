import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId?: string) {
    const where = storeId ? { storeId } : {};
    return this.prisma.product.findMany({
      where,
      include: { store: { select: { id: true, name: true, slug: true } }, category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { store: true, category: true, images: { orderBy: { sortOrder: "asc" } }, variants: true },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async findBySlug(storeSlug: string, productSlug: string) {
    const store = await this.prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store) throw new NotFoundException("Store not found");
    const product = await this.prisma.product.findFirst({
      where: { storeId: store.id, slug: productSlug },
      include: { store: true, category: true, images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-)/g, "") + "-" + Date.now().toString(36);
    const product = await this.prisma.product.create({
      data: {
        storeId: data.storeId,
        categoryId: data.categoryId || null,
        name: data.name,
        slug,
        description: data.description || null,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        sku: data.sku || null,
        stock: Number(data.stock) || 0,
        status: data.status || "ACTIVE",
        isFeatured: data.isFeatured || false,
      },
    });
    if (data.images && data.images.length > 0) {
      await this.prisma.productImage.createMany({
        data: data.images.map((url: string, i: number) => ({
          productId: product.id,
          url,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      });
    }
    return this.prisma.product.findUnique({ where: { id: product.id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  }

  async update(id: string, data: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? Number(data.compareAtPrice) : null;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    await this.prisma.product.update({ where: { id }, data: updateData });
    if (data.images !== undefined) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length > 0) {
        await this.prisma.productImage.createMany({
          data: data.images.map((url: string, i: number) => ({
            productId: id,
            url,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        });
      }
    }
    return this.prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  }

  async delete(id: string) {
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.orderItem.deleteMany({ where: { productId: id } });
    await this.prisma.product.delete({ where: { id } });
    return { message: "Product deleted" };
  }
}