import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Admin dashboard" })
  getDashboard() {
    return this.svc.getDashboard();
  }

  @Get("stores")
  @ApiOperation({ summary: "All stores" })
  getStores() {
    return this.svc.getStores();
  }

  @Post("stores/:id/suspend")
  @ApiOperation({ summary: "Suspend store" })
  suspend(@Param("id") id: string) {
    return this.svc.suspendStore(id);
  }

  @Post("stores/:id/activate")
  @ApiOperation({ summary: "Activate store" })
  activate(@Param("id") id: string) {
    return this.svc.activateStore(id);
  }

  @Get("payments")
  @ApiOperation({ summary: "Get all payment submissions" })
  getAllPayments() {
    return this.svc.getAllPayments();
  }

  @Get("payments/pending")
  @ApiOperation({ summary: "Get pending payments" })
  getPendingPayments() {
    return this.svc.getPendingPayments();
  }

  @Post("payments/:id/approve")
  @ApiOperation({ summary: "Approve payment" })
  approvePayment(@Param("id") id: string, @Body() body: any) {
    return this.svc.approvePayment(id, body.adminNote);
  }

  @Post("payments/:id/reject")
  @ApiOperation({ summary: "Reject payment" })
  rejectPayment(@Param("id") id: string, @Body() body: any) {
    return this.svc.rejectPayment(id, body.adminNote);
  }
}
