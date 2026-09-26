import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private svc: SubscriptionsService) {}

  @Get("plans")
  @ApiOperation({ summary: "Get subscription plans" })
  getPlans() { return this.svc.getPlans(); }

  @Get("my-subscription/:storeId")
  @ApiOperation({ summary: "Get my subscription" })
  getMySubscription(@Param("storeId") storeId: string) { return this.svc.getMySubscription(storeId); }

  @Get("my-payments/:storeId")
  @ApiOperation({ summary: "Get my payments" })
  getMyPayments(@Param("storeId") storeId: string) { return this.svc.getMyPayments(storeId); }

  @Post("submit-payment/:storeId")
  @ApiOperation({ summary: "Submit payment" })
  submitPayment(@Param("storeId") storeId: string, @Body() body: any) { return this.svc.submitPayment(storeId, body); }
}