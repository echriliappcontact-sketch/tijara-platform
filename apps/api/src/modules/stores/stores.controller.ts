import { Controller, Get, Put, Delete, Param, Body, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StoresService } from "./stores.service";

@ApiTags("Stores")
@Controller("stores")
export class StoresController {
  constructor(private svc: StoresService) {}

  @Get() @ApiOperation({ summary: "List stores" })
  findAll() { return this.svc.findAll(); }

  @Get("by-slug/:slug") @ApiOperation({ summary: "Public store by slug" })
  findBySlug(@Param("slug") slug: string) { return this.svc.findBySlug(slug); }

  @Get("by-owner/:ownerId") @ApiOperation({ summary: "Find store by owner" })
  findByOwner(@Param("ownerId") ownerId: string) { return this.svc.findByOwner(ownerId); }

  @Get(":id") @ApiOperation({ summary: "Get store" })
  findOne(@Param("id") id: string) { return this.svc.findOne(id); }

  @Get(":id/delivery") @ApiOperation({ summary: "Get delivery settings" })
  getDelivery(@Param("id") id: string) { return this.svc.getDeliverySettings(id); }

  @Put(":id/delivery/:wilayaCode") @ApiOperation({ summary: "Update delivery for wilaya" })
  updateDelivery(@Param("id") id: string, @Param("wilayaCode") wilayaCode: string, @Body() body: any) {
    return this.svc.updateDeliverySetting(id, wilayaCode, body);
  }

  @Post(":id/delivery/bulk") @ApiOperation({ summary: "Bulk update delivery" })
  bulkDelivery(@Param("id") id: string, @Body() body: any) {
    return this.svc.bulkUpdateDelivery(id, body.settings);
  }

  @Put(":id") @ApiOperation({ summary: "Update store" })
  update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(":id") @ApiOperation({ summary: "Delete store" })
  delete(@Param("id") id: string) { return this.svc.delete(id); }
}