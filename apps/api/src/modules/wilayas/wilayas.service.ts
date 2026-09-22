import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class WilayasService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.wilaya.findMany({ where: { isActive: true }, orderBy: { code: "asc" } }); }
  async findByCode(code: string) { return this.prisma.wilaya.findUnique({ where: { code } }); }
}
