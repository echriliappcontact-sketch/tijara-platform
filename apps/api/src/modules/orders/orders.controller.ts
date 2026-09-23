import { Controller, Get, Post, Put, Delete, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Get() @ApiOperation({ summary: "List orders" })
  findAll(@Query("storeId") storeId?: string) { return this.svc.findAll(storeId); }

  @Get(":id") @ApiOperation({ summary: "Get order" })
  findOne(@Param("id") id: string) { return this.svc.findOne(id); }

  @Post() @ApiOperation({ summary: "Create order" })
  create(@Body() body: any) { return this.svc.create(body); }

  @Put(":id/status") @ApiOperation({ summary: "Update order status" })
  updateStatus(@Param("id") id: string, @Body() body: any) { return this.svc.updateStatus(id, body.status, body.note); }

  @Put(":id") @ApiOperation({ summary: "Update order" })
  update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(":id") @ApiOperation({ summary: "Delete order" })
  delete(@Param("id") id: string) { return this.svc.delete(id); }
}