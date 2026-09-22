import { Controller, Get, Post, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
@ApiTags("Admin") @Controller("admin")
export class AdminController {
  constructor(private svc: AdminService) {}
  @Get("dashboard") @ApiOperation({ summary: "Admin dashboard" }) getDashboard() { return this.svc.getDashboard(); }
  @Get("stores") @ApiOperation({ summary: "All stores" }) getStores() { return this.svc.getStores(); }
  @Post("stores/:id/suspend") @ApiOperation({ summary: "Suspend store" }) suspend(@Param("id") id: string) { return this.svc.suspendStore(id); }
  @Post("stores/:id/activate") @ApiOperation({ summary: "Activate store" }) activate(@Param("id") id: string) { return this.svc.activateStore(id); }
}
