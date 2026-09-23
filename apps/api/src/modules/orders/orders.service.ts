import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId?: string) {
    const where = storeId ? { storeId } : {};
    return this.prisma.order.findMany({ where, include: { store: { select: { id: true, name: true } }, items: true, statusHistory: true }, orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { store: true, items: true, customer: true, statusHistory: { orderBy: { createdAt: "desc" } } } });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async create(data: any) {
    const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
    if (!store) throw new NotFoundException("Store not found");
    const count = await this.prisma.order.count({ where: { storeId: data.storeId } });
    const orderNumber = "ORD-" + String(count + 1).padStart(5, "0");

    return this.prisma.order.create({
      data: {
        storeId: data.storeId, customerId: data.customerId || null, orderNumber,
        customerName: data.customerName, customerPhone: data.customerPhone, customerEmail: data.customerEmail || null,
        wilayaCode: data.wilayaCode, commune: data.commune || null, address: data.address,
        notes: data.notes || null, subtotal: data.subtotal, shippingCost: data.shippingCost || 0,
        discountAmount: data.discountAmount || 0, total: data.total,
        paymentMethod: data.paymentMethod || "COD", deliveryType: data.deliveryType || "HOME",
        items: { create: (data.items || []).map((item: any) => ({ productId: item.productId, productName: item.productName, price: item.price, quantity: item.quantity, total: item.price * item.quantity, image: item.image || null })) },
        statusHistory: { create: { status: "PENDING", note: "Order created" } },
      },
      include: { items: true },
    });
  }

  async updateStatus(id: string, status: string, note?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found");
    await this.prisma.orderStatusHistory.create({ data: { orderId: id, status, note: note || null } });
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: any) {
    return this.prisma.order.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.order.delete({ where: { id } });
    return { message: "Order deleted" };
  }
}