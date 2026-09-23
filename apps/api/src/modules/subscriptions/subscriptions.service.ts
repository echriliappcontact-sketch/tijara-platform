import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  async submitPayment(storeId: string, data: any) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
    if (!plan) throw new NotFoundException("Plan not found");
    const payment = await this.prisma.subscriptionPayment.create({
      data: { storeId, planId: data.planId, amount: plan.price, transactionRef: data.transactionRef, receiptUrl: data.receiptUrl || null, paymentMethod: data.paymentMethod || "BARIDIMOB" },
    });
    return { message: "Payment submitted. Waiting for admin approval.", payment: { id: payment.id, amount: payment.amount, status: payment.status, transactionRef: payment.transactionRef } };
  }

  async getMyPayments(storeId: string) {
    return this.prisma.subscriptionPayment.findMany({ where: { storeId }, include: { plan: true }, orderBy: { createdAt: "desc" } });
  }

  async getMySubscription(storeId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException("Store not found");

    const now = new Date();
    const trialEndsAt = store.trialEndsAt;
    const isTrialActive = store.status === "TRIAL" && trialEndsAt && trialEndsAt > now;

    const lastApproved = await this.prisma.subscriptionPayment.findFirst({
      where: { storeId, status: "APPROVED" },
      include: { plan: true },
      orderBy: { reviewedAt: "desc" },
    });

    if (lastApproved && lastApproved.reviewedAt) {
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
      };
    }

    if (isTrialActive) {
      return {
        status: "TRIAL",
        plan: null,
        endDate: trialEndsAt.toISOString(),
        daysLeft: Math.ceil((trialEndsAt.getTime() - now.getTime()) / 86400000),
        storeStatus: store.status,
      };
    }

    return { status: "EXPIRED", plan: null, daysLeft: 0, storeStatus: store.status };
  }
}