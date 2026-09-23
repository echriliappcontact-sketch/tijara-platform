import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, isActive: true, createdAt: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, isActive: true, createdAt: true },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: { firstName: data.firstName, lastName: data.lastName, phone: data.phone, avatar: data.avatar },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, isActive: true },
    });
  }

  async changeEmail(id: string, newEmail: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== id) throw new ConflictException("Email already in use");
    return this.prisma.user.update({ where: { id }, data: { email: newEmail }, select: { id: true, email: true, firstName: true, lastName: true } });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new ConflictException("Current password is incorrect");
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id }, data: { passwordHash: hash } });
    return { message: "Password changed successfully" };
  }

  async uploadAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({ where: { id }, data: { avatar: avatarUrl }, select: { id: true, email: true, firstName: true, lastName: true, avatar: true } });
  }
}
