import { Controller, Get, Put, Post, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get() @ApiOperation({ summary: "List all users" })
  findAll() { return this.svc.findAll(); }

  @Get(":id") @ApiOperation({ summary: "Get user" })
  findOne(@Param("id") id: string) { return this.svc.findOne(id); }

  @Put(":id") @ApiOperation({ summary: "Update user profile" })
  update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Post(":id/change-email") @ApiOperation({ summary: "Change email" })
  changeEmail(@Param("id") id: string, @Body() body: any) { return this.svc.changeEmail(id, body.email); }

  @Post(":id/change-password") @ApiOperation({ summary: "Change password" })
  changePassword(@Param("id") id: string, @Body() body: any) { return this.svc.changePassword(id, body.currentPassword, body.newPassword); }

  @Post(":id/avatar") @ApiOperation({ summary: "Upload avatar" })
  uploadAvatar(@Param("id") id: string, @Body() body: any) { return this.svc.uploadAvatar(id, body.avatar); }
}
