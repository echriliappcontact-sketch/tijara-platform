import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: any) {
    const page = parseInt(query.page) || 1, limit = parseInt(query.limit) || 20;
    const where: any = {};
    if (query.storeId) where.storeId = query.storeId;
    if (query.status) where.status = query.status;
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({ skip: (page-1)*limit, take: limit, where, include: { items: true }, orderBy: { createdAt: "desc" } }),
      this.prisma.order.count({ where }),
    ]);
    return { items, total, page, limit };
  }
  async findOne(id: string) { const o = await this.prisma.order.findUnique({ where: { id }, include: { items: true } }); if (!o) throw new NotFoundException(); return o; }
  async create(data: any) {
    const num = "ORD-" + Date.now().toString(36).toUpperCase();
    return this.prisma.order.create({ data: { storeId: data.storeId, orderNumber: num, customerName: data.customerName, customerPhone: data.customerPhone, customerEmail: data.customerEmail, wilayaCode: data.wilayaCode, address: data.address, notes: data.notes, subtotal: data.subtotal, shippingCost: data.shippingCost || 0, total: data.subtotal + (data.shippingCost || 0), items: { create: (data.items || []).map((i: any) => ({ productId: i.productId, productName: i.productName, price: i.price, quantity: i.quantity, total: i.price * i.quantity })) } }, include: { items: true } });
  }
  async updateStatus(id: string, status: string) { return this.prisma.order.update({ where: { id }, data: { status } }); }
}
