import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.store.findMany({ include: { owner: true, settings: true }, orderBy: { createdAt: "desc" } }); }
  async findOne(id: string) { return this.prisma.store.findUnique({ where: { id }, include: { owner: true, settings: true, categories: true, products: true } }); }
  async update(id: string, data: any) { return this.prisma.store.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.store.delete({ where: { id } }); }
}
