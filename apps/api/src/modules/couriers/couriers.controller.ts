import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CouriersService } from "./couriers.service";
@ApiTags("Couriers") @Controller("couriers")
export class CouriersController {
  constructor(private svc: CouriersService) {}
  @Get() @ApiOperation({ summary: "List couriers" }) findAll() { return this.svc.findAll(); }
  @Get(":id") @ApiOperation({ summary: "Get courier" }) findOne(@Param("id") id: string) { return this.svc.findOne(id); }
}
