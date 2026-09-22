import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private svc: SubscriptionsService) {}

  @Get("plans")
  @ApiOperation({ summary: "Get all subscription plans" })
  getPlans() {
    return this.svc.getPlans();
  }

  @Post("payment")
  @ApiOperation({ summary: "Submit subscription payment" })
  submitPayment(@Body() body: any) {
    return this.svc.submitPayment(body.storeId, body);
  }

  @Get("payments/:storeId")
  @ApiOperation({ summary: "Get my payment history" })
  getMyPayments(@Param("storeId") storeId: string) {
    return this.svc.getMyPayments(storeId);
  }

  @Get("my-subscription/:storeId")
  @ApiOperation({ summary: "Get my subscription status" })
  getMySubscription(@Param("storeId") storeId: string) {
    return this.svc.getMySubscription(storeId);
  }
}
