import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.user.findMany({ include: { roles: true } }); }
  async findOne(id: string) { return this.prisma.user.findUnique({ where: { id }, include: { roles: true, ownedStores: true } }); }
  async update(id: string, data: any) { return this.prisma.user.update({ where: { id }, data }); }
}
