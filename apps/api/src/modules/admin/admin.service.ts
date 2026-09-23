import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [orders, customers, products, stores, pendingPayments, users] = await Promise.all([
      this.prisma.order.count(), this.prisma.customer.count(), this.prisma.product.count(),
      this.prisma.store.count(), this.prisma.subscriptionPayment.count({ where: { status: "PENDING" } }), this.prisma.user.count(),
    ]);
    const revenue = await this.prisma.order.aggregate({ _sum: { total: true } });
    return { totalOrders: orders, totalCustomers: customers, totalProducts: products, totalStores: stores, pendingPayments, totalUsers: users, totalRevenue: revenue._sum.total || 0 };
  }

  async getSettings() {
    const plans = await this.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
    return { plans, paymentInfo: { accountNumber: "0079999900123456789", accountName: "TIJARA PLATFORM", ccp: "1234567890" } };
  }

  async getUsers() { return this.prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, isActive: true, createdAt: true }, orderBy: { createdAt: "desc" } }); }
  async updateUser(id: string, data: any) { return this.prisma.user.update({ where: { id }, data: { firstName: data.firstName, lastName: data.lastName, phone: data.phone, isActive: data.isActive } }); }
  async deleteUser(id: string) { await this.prisma.user.delete({ where: { id } }); return { message: "User deleted" }; }
  async resetUserPassword(id: string, newPassword: string) { const hash = await bcrypt.hash(newPassword, 12); await this.prisma.user.update({ where: { id }, data: { passwordHash: hash } }); return { message: "Password reset successfully" }; }

  async getStores() { return this.prisma.store.findMany({ include: { owner: { select: { id: true, email: true, firstName: true } } }, orderBy: { createdAt: "desc" } }); }
  async updateStore(id: string, data: any) { return this.prisma.store.update({ where: { id }, data }); }
  async suspendStore(id: string) { return this.prisma.store.update({ where: { id }, data: { status: "SUSPENDED" } }); }
  async activateStore(id: string) { return this.prisma.store.update({ where: { id }, data: { status: "ACTIVE" } }); }
  async deleteStore(id: string) { await this.prisma.store.delete({ where: { id } }); return { message: "Store deleted" }; }

  async getProducts() { return this.prisma.product.findMany({ include: { store: { select: { id: true, name: true } }, category: true }, orderBy: { createdAt: "desc" } }); }
  async updateProduct(id: string, data: any) { return this.prisma.product.update({ where: { id }, data }); }
  async deleteProduct(id: string) { await this.prisma.product.delete({ where: { id } }); return { message: "Product deleted" }; }

  async getOrders() { return this.prisma.order.findMany({ include: { store: { select: { id: true, name: true } }, items: true }, orderBy: { createdAt: "desc" } }); }
  async updateOrder(id: string, data: any) { return this.prisma.order.update({ where: { id }, data }); }
  async deleteOrder(id: string) { await this.prisma.order.delete({ where: { id } }); return { message: "Order deleted" }; }

  async getPlans() { return this.prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: "asc" } }); }
  async createPlan(data: any) { return this.prisma.subscriptionPlan.create({ data: { name: data.name, slug: data.slug, description: data.description, price: data.price, duration: data.duration, maxProducts: data.maxProducts, maxOrders: data.maxOrders, maxStaff: data.maxStaff || 1, features: JSON.stringify(data.features || []), isPopular: data.isPopular || false, sortOrder: data.sortOrder || 0 } }); }
  async updatePlan(id: string, data: any) { const d: any = { ...data }; if (d.features && typeof d.features === "object") d.features = JSON.stringify(d.features); return this.prisma.subscriptionPlan.update({ where: { id }, data: d }); }
  async deletePlan(id: string) { await this.prisma.subscriptionPlan.delete({ where: { id } }); return { message: "Plan deleted" }; }

  async getAllPayments() { return this.prisma.subscriptionPayment.findMany({ include: { plan: true, store: { select: { id: true, name: true, slug: true, email: true, phone: true } } }, orderBy: { createdAt: "desc" } }); }
  async getPendingPayments() { return this.prisma.subscriptionPayment.findMany({ where: { status: "PENDING" }, include: { plan: true, store: { select: { id: true, name: true, slug: true, email: true, phone: true } } }, orderBy: { createdAt: "asc" } }); }
  async approvePayment(paymentId: string, adminNote?: string) { const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } }); if (!payment) throw new NotFoundException("Payment not found"); if (payment.status !== "PENDING") throw new BadRequestException("Already reviewed"); await this.prisma.subscriptionPayment.update({ where: { id: paymentId }, data: { status: "APPROVED", adminNote: adminNote || null, reviewedAt: new Date() } }); await this.prisma.store.update({ where: { id: payment.storeId }, data: { status: "ACTIVE" } }); return { message: "Payment approved. Store activated!" }; }
  async rejectPayment(paymentId: string, adminNote: string) { const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } }); if (!payment) throw new NotFoundException("Payment not found"); if (payment.status !== "PENDING") throw new BadRequestException("Already reviewed"); await this.prisma.subscriptionPayment.update({ where: { id: paymentId }, data: { status: "REJECTED", adminNote, reviewedAt: new Date() } }); return { message: "Payment rejected." }; }

  async getCouriers() { return this.prisma.courier.findMany({ orderBy: { name: "asc" } }); }
  async createCourier(data: any) { return this.prisma.courier.create({ data }); }
  async updateCourier(id: string, data: any) { return this.prisma.courier.update({ where: { id }, data }); }
  async deleteCourier(id: string) { await this.prisma.courier.delete({ where: { id } }); return { message: "Courier deleted" }; }

  async getWilayas() { return this.prisma.wilaya.findMany({ orderBy: { code: "asc" } }); }
  async updateWilaya(id: string, data: any) { return this.prisma.wilaya.update({ where: { id }, data }); }

  async getCoupons() { return this.prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }); }
  async createCoupon(data: any) { return this.prisma.coupon.create({ data }); }
  async updateCoupon(id: string, data: any) { return this.prisma.coupon.update({ where: { id }, data }); }
  async deleteCoupon(id: string) { await this.prisma.coupon.delete({ where: { id } }); return { message: "Coupon deleted" }; }
}
