import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}
  async getDashboard() {
    const orders = await this.prisma.order.count();
    const revenue = await this.prisma.order.aggregate({ _sum: { total: true } });
    return { totalOrders: orders, totalRevenue: revenue._sum.total || 0 };
  }
}
