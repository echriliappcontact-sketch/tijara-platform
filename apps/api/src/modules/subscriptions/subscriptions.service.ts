import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  async submitPayment(storeId: string, data: any) {
    try {
      if (!storeId || storeId === "undefined") throw new BadRequestException("Store ID required");
      if (!data.planId) throw new BadRequestException("Plan ID required");

      const store = await this.prisma.store.findUnique({ where: { id: storeId } });
      if (!store) throw new NotFoundException("Store not found. Please re-login.");

      const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
      if (!plan) throw new NotFoundException("Plan not found");

      const payment = await this.prisma.subscriptionPayment.create({
        data: {
          storeId,
          planId: data.planId,
          amount: plan.price,
          transactionRef: data.transactionRef || "MANUAL",
          receiptUrl: data.receiptUrl || null,
          paymentMethod: data.paymentMethod || "BARIDIMOB",
          status: "PENDING",
        },
      });
      return { message: "Payment submitted. Waiting for admin approval.", payment: { id: payment.id, amount: payment.amount, status: payment.status } };
    } catch (e: any) {
      if (e.status) throw e;
      console.error("submitPayment error:", e.message);
      throw new InternalServerErrorException("Failed to submit payment: " + e.message);
    }
  }

  async getMyPayments(storeId: string) {
    try {
      return await this.prisma.subscriptionPayment.findMany({
        where: { storeId },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      return [];
    }
  }

  async getMySubscription(storeId: string) {
    try {
      const store = await this.prisma.store.findUnique({ where: { id: storeId } });
      if (!store) return { status: "EXPIRED", plan: null, daysLeft: 0, storeName: "Unknown", storeSlug: "", storeUrl: "" };

      const now = new Date();
      const trialEndsAt = store.trialEndsAt;
      const isTrialActive = store.status === "TRIAL" && trialEndsAt && trialEndsAt > now;

      const lastApproved = await this.prisma.subscriptionPayment.findFirst({
        where: { storeId, status: "APPROVED" },
        include: { plan: true },
        orderBy: { reviewedAt: "desc" },
      });

      if (lastApproved && lastApproved.reviewedAt && lastApproved.plan) {
        const endDate = new Date(lastApproved.reviewedAt);
        endDate.setDate(endDate.getDate() + lastApproved.plan.duration);
        const isSubActive = endDate > now;
        return {
          status: isSubActive ? "ACTIVE" : "EXPIRED",
          plan: lastApproved.plan,
          startDate: lastApproved.reviewedAt,
          endDate: endDate.toISOString(),
          daysLeft: isSubActive ? Math.ceil((endDate.getTime() - now.getTime()) / 86400000) : 0,
          storeStatus: store.status,
          storeName: store.name,
          storeSlug: store.slug,
          storeUrl: "/store/" + store.slug,
          maxProducts: lastApproved.plan.maxProducts,
          maxOrders: lastApproved.plan.maxOrders,
          maxStaff: lastApproved.plan.maxStaff,
        };
      }

      if (isTrialActive) {
        return {
          status: "TRIAL", plan: null,
          endDate: trialEndsAt!.toISOString(),
          daysLeft: Math.ceil((trialEndsAt!.getTime() - now.getTime()) / 86400000),
          storeStatus: store.status,
          storeName: store.name,
          storeSlug: store.slug,
          storeUrl: "/store/" + store.slug,
        };
      }

      return { status: "EXPIRED", plan: null, daysLeft: 0, storeStatus: store.status, storeName: store.name, storeSlug: store.slug, storeUrl: "/store/" + store.slug };
    } catch (e) {
      return { status: "EXPIRED", plan: null, daysLeft: 0 };
    }
  }
}