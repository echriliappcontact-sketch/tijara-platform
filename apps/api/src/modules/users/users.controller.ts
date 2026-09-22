import { Controller, Get, Put, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
@ApiTags("Users") @Controller("users")
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() @ApiOperation({ summary: "List users" }) findAll() { return this.svc.findAll(); }
  @Get(":id") @ApiOperation({ summary: "Get user" }) findOne(@Param("id") id: string) { return this.svc.findOne(id); }
  @Put(":id") @ApiOperation({ summary: "Update user" }) update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }
}
