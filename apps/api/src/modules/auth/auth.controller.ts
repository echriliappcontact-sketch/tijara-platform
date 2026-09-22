import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private svc: AuthService) {}
  @Post("register") @ApiOperation({ summary: "Register new merchant" }) register(@Body() body: any) { return this.svc.register(body); }
  @Post("login") @ApiOperation({ summary: "Login" }) login(@Body() body: any) { return this.svc.login(body); }
}
