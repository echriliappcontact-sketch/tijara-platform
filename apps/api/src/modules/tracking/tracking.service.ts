import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}
  async track(orderNumber: string) {
    const o = await this.prisma.order.findFirst({ where: { orderNumber }, include: { items: true } });
    if (!o) throw new NotFoundException("Order not found");
    return o;
  }
}
