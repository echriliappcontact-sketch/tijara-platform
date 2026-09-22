import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [orders, customers, products, stores, pendingPayments] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.customer.count(),
      this.prisma.product.count(),
      this.prisma.store.count(),
      this.prisma.subscriptionPayment.count({ where: { status: "PENDING" } }),
    ]);
    const revenue = await this.prisma.order.aggregate({ _sum: { total: true } });
    return {
      totalOrders: orders,
      totalCustomers: customers,
      totalProducts: products,
      totalStores: stores,
      pendingPayments,
      totalRevenue: revenue._sum.total || 0,
    };
  }

  async getStores() {
    return this.prisma.store.findMany({
      include: { owner: { select: { id: true, email: true, firstName: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async suspendStore(id: string) {
    return this.prisma.store.update({ where: { id }, data: { status: "SUSPENDED" } });
  }

  async activateStore(id: string) {
    return this.prisma.store.update({ where: { id }, data: { status: "ACTIVE" } });
  }

  async getAllPayments() {
    return this.prisma.subscriptionPayment.findMany({
      include: {
        plan: true,
        store: { select: { id: true, name: true, slug: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPendingPayments() {
    return this.prisma.subscriptionPayment.findMany({
      where: { status: "PENDING" },
      include: {
        plan: true,
        store: { select: { id: true, name: true, slug: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async approvePayment(paymentId: string, adminNote?: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.status !== "PENDING") throw new BadRequestException("Payment already reviewed");

    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: { status: "APPROVED", adminNote: adminNote || null, reviewedAt: new Date() },
    });

    await this.prisma.store.update({
      where: { id: payment.storeId },
      data: { status: "ACTIVE" },
    });

    return { message: "Payment approved. Store activated!" };
  }

  async rejectPayment(paymentId: string, adminNote: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.status !== "PENDING") throw new BadRequestException("Payment already reviewed");

    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: { status: "REJECTED", adminNote, reviewedAt: new Date() },
    });

    return { message: "Payment rejected." };
  }
}
