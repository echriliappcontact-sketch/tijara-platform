import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async getDashboard() {
    const [orders, customers, products, stores] = await Promise.all([
      this.prisma.order.count(), this.prisma.user.count(),
      this.prisma.product.count(), this.prisma.store.count(),
    ]);
    const revenue = await this.prisma.order.aggregate({ _sum: { total: true } });
    return { totalOrders: orders, totalCustomers: customers, totalProducts: products, totalStores: stores, totalRevenue: revenue._sum.total || 0 };
  }
  async getStores() { return this.prisma.store.findMany({ include: { owner: true }, orderBy: { createdAt: "desc" } }); }
  async suspendStore(id: string) { return this.prisma.store.update({ where: { id }, data: { status: "SUSPENDED" } }); }
  async activateStore(id: string) { return this.prisma.store.update({ where: { id }, data: { status: "ACTIVE" } }); }
}
