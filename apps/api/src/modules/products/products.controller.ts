import { Controller, Get, Post, Put, Delete, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
@ApiTags("Products") @Controller("products")
export class ProductsController {
  constructor(private svc: ProductsService) {}
  @Get() @ApiOperation({ summary: "List products" }) findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Get(":id") @ApiOperation({ summary: "Get product" }) findOne(@Param("id") id: string) { return this.svc.findOne(id); }
  @Post() @ApiOperation({ summary: "Create product" }) create(@Body() body: any) { return this.svc.create(body); }
  @Put(":id") @ApiOperation({ summary: "Update product" }) update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }
  @Delete(":id") @ApiOperation({ summary: "Delete product" }) remove(@Param("id") id: string) { return this.svc.remove(id); }
}
