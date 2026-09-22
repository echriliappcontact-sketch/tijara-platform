import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async submitPayment(storeId: string, data: any) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
    if (!plan) throw new NotFoundException("Plan not found");

    const payment = await this.prisma.subscriptionPayment.create({
      data: {
        storeId,
        planId: data.planId,
        amount: plan.price,
        transactionRef: data.transactionRef,
        receiptUrl: data.receiptUrl || null,
        paymentMethod: data.paymentMethod || "BARIDIMOB",
      },
    });

    return {
      message: "Payment submitted successfully. Waiting for admin approval.",
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        transactionRef: payment.transactionRef,
      },
    };
  }

  async getMyPayments(storeId: string) {
    return this.prisma.subscriptionPayment.findMany({
      where: { storeId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getMySubscription(storeId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException("Store not found");

    const lastApproved = await this.prisma.subscriptionPayment.findFirst({
      where: { storeId, status: "APPROVED" },
      include: { plan: true },
      orderBy: { reviewedAt: "desc" },
    });

    const now = new Date();
    const trialEndsAt = store.trialEndsAt;
    const isTrialActive = store.status === "TRIAL" && trialEndsAt && trialEndsAt > now;

    if (lastApproved && lastApproved.reviewedAt) {
      const endDate = new Date(lastApproved.reviewedAt);
      endDate.setDate(endDate.getDate() + lastApproved.plan.duration);
      const isSubActive = endDate > now;

      return {
        status: isSubActive ? "ACTIVE" : "EXPIRED",
        plan: lastApproved.plan,
        startDate: lastApproved.reviewedAt,
        endDate,
        daysLeft: isSubActive ? Math.ceil((endDate.getTime() - now.getTime()) / 86400000) : 0,
      };
    }

    if (isTrialActive) {
      return {
        status: "TRIAL",
        plan: null,
        endDate: trialEndsAt,
        daysLeft: Math.ceil((trialEndsAt.getTime() - now.getTime()) / 86400000),
      };
    }

    return { status: "EXPIRED", plan: null, daysLeft: 0 };
  }

  async getAllPayments() {
    return this.prisma.subscriptionPayment.findMany({
      include: { plan: true, store: { select: { id: true, name: true, slug: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async approvePayment(paymentId: string, adminNote?: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.status !== "PENDING") throw new BadRequestException("Payment already reviewed");

    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: { status: "APPROVED", adminNote: adminNote || null, reviewedAt: new Date() },
    });

    await this.prisma.store.update({
      where: { id: payment.storeId },
      data: { status: "ACTIVE" },
    });

    return { message: "Payment approved. Store activated!" };
  }

  async rejectPayment(paymentId: string, adminNote: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.status !== "PENDING") throw new BadRequestException("Payment already reviewed");

    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: { status: "REJECTED", adminNote, reviewedAt: new Date() },
    });

    return { message: "Payment rejected." };
  }
}
