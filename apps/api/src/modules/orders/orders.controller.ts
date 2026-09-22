import { Controller, Get, Post, Put, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
@ApiTags("Orders") @Controller("orders")
export class OrdersController {
  constructor(private svc: OrdersService) {}
  @Get() @ApiOperation({ summary: "List orders" }) findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Get(":id") @ApiOperation({ summary: "Get order" }) findOne(@Param("id") id: string) { return this.svc.findOne(id); }
  @Post() @ApiOperation({ summary: "Create order" }) create(@Body() body: any) { return this.svc.create(body); }
  @Put(":id/status") @ApiOperation({ summary: "Update status" }) updateStatus(@Param("id") id: string, @Body() body: any) { return this.svc.updateStatus(id, body.status); }
}
