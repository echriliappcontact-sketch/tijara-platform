import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: any) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException("Email already exists");
    const hash = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: { email: data.email, passwordHash: hash, firstName: data.firstName, lastName: data.lastName },
    });
    let role = await this.prisma.role.findUnique({ where: { name: "MERCHANT" } });
    if (!role) role = await this.prisma.role.create({ data: { name: "MERCHANT", displayName: "Merchant" } });
    const store = await this.prisma.store.create({
      data: { ownerId: user.id, name: data.storeName || data.firstName + " Store", slug: data.storeSlug || ("store-" + Date.now()), email: data.email },
    });
    await this.prisma.storeSettings.create({ data: { storeId: store.id } });
    await this.prisma.userRole.create({ data: { userId: user.id, roleId: role.id, storeId: store.id } });
    const token = this.jwt.sign({ sub: user.id, email: user.email, storeId: store.id });
    return { user: { id: user.id, email: user.email, firstName: user.firstName }, store: { id: store.id, name: store.name, slug: store.slug }, token };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email }, include: { roles: { include: { store: true } } } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");
    const storeId = user.roles[0]?.storeId || "";
    const token = this.jwt.sign({ sub: user.id, email: user.email, storeId });
    return { user: { id: user.id, email: user.email, firstName: user.firstName }, token };
  }
}
