import { Controller, Get, Put, Delete, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StoresService } from "./stores.service";
@ApiTags("Stores") @Controller("stores")
export class StoresController {
  constructor(private svc: StoresService) {}
  @Get() @ApiOperation({ summary: "List stores" }) findAll() { return this.svc.findAll(); }
  @Get(":id") @ApiOperation({ summary: "Get store" }) findOne(@Param("id") id: string) { return this.svc.findOne(id); }
  @Put(":id") @ApiOperation({ summary: "Update store" }) update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }
  @Delete(":id") @ApiOperation({ summary: "Delete store" }) remove(@Param("id") id: string) { return this.svc.remove(id); }
}
