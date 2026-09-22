import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WilayasService } from "./wilayas.service";
@ApiTags("Wilayas") @Controller("wilayas")
export class WilayasController {
  constructor(private svc: WilayasService) {}
  @Get() @ApiOperation({ summary: "List wilayas" }) findAll() { return this.svc.findAll(); }
  @Get(":code") @ApiOperation({ summary: "Get wilaya" }) findByCode(@Param("code") code: string) { return this.svc.findByCode(code); }
}
