import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class CouriersService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.courier.findMany({ where: { isActive: true } }); }
  async findOne(id: string) { return this.prisma.courier.findUnique({ where: { id } }); }
}
