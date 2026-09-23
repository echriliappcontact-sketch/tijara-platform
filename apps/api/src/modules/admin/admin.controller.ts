import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get("dashboard") @ApiOperation({ summary: "Admin dashboard" })
  getDashboard() { return this.svc.getDashboard(); }

  @Get("settings") @ApiOperation({ summary: "Get settings and plans" })
  getSettings() { return this.svc.getSettings(); }

  // Users
  @Get("users") @ApiOperation({ summary: "All users" })
  getUsers() { return this.svc.getUsers(); }
  @Put("users/:id") @ApiOperation({ summary: "Update user" })
  updateUser(@Param("id") id: string, @Body() body: any) { return this.svc.updateUser(id, body); }
  @Delete("users/:id") @ApiOperation({ summary: "Delete user" })
  deleteUser(@Param("id") id: string) { return this.svc.deleteUser(id); }
  @Post("users/:id/reset-password") @ApiOperation({ summary: "Reset user password" })
  resetPassword(@Param("id") id: string, @Body() body: any) { return this.svc.resetUserPassword(id, body.password); }

  // Stores
  @Get("stores") @ApiOperation({ summary: "All stores" })
  getStores() { return this.svc.getStores(); }
  @Put("stores/:id") @ApiOperation({ summary: "Update store" })
  updateStore(@Param("id") id: string, @Body() body: any) { return this.svc.updateStore(id, body); }
  @Post("stores/:id/suspend") @ApiOperation({ summary: "Suspend store" })
  suspendStore(@Param("id") id: string) { return this.svc.suspendStore(id); }
  @Post("stores/:id/activate") @ApiOperation({ summary: "Activate store" })
  activateStore(@Param("id") id: string) { return this.svc.activateStore(id); }
  @Delete("stores/:id") @ApiOperation({ summary: "Delete store" })
  deleteStore(@Param("id") id: string) { return this.svc.deleteStore(id); }

  // Products
  @Get("products") @ApiOperation({ summary: "All products" })
  getProducts() { return this.svc.getProducts(); }
  @Put("products/:id") @ApiOperation({ summary: "Update product" })
  updateProduct(@Param("id") id: string, @Body() body: any) { return this.svc.updateProduct(id, body); }
  @Delete("products/:id") @ApiOperation({ summary: "Delete product" })
  deleteProduct(@Param("id") id: string) { return this.svc.deleteProduct(id); }

  // Orders
  @Get("orders") @ApiOperation({ summary: "All orders" })
  getOrders() { return this.svc.getOrders(); }
  @Put("orders/:id") @ApiOperation({ summary: "Update order" })
  updateOrder(@Param("id") id: string, @Body() body: any) { return this.svc.updateOrder(id, body); }
  @Delete("orders/:id") @ApiOperation({ summary: "Delete order" })
  deleteOrder(@Param("id") id: string) { return this.svc.deleteOrder(id); }

  // Plans
  @Get("plans") @ApiOperation({ summary: "All plans" })
  getPlans() { return this.svc.getPlans(); }
  @Post("plans") @ApiOperation({ summary: "Create plan" })
  createPlan(@Body() body: any) { return this.svc.createPlan(body); }
  @Put("plans/:id") @ApiOperation({ summary: "Update plan" })
  updatePlan(@Param("id") id: string, @Body() body: any) { return this.svc.updatePlan(id, body); }
  @Delete("plans/:id") @ApiOperation({ summary: "Delete plan" })
  deletePlan(@Param("id") id: string) { return this.svc.deletePlan(id); }

  // Payments
  @Get("payments") @ApiOperation({ summary: "All payments" })
  getAllPayments() { return this.svc.getAllPayments(); }
  @Get("payments/pending") @ApiOperation({ summary: "Pending payments" })
  getPendingPayments() { return this.svc.getPendingPayments(); }
  @Post("payments/:id/approve") @ApiOperation({ summary: "Approve payment" })
  approvePayment(@Param("id") id: string, @Body() body: any) { return this.svc.approvePayment(id, body.adminNote); }
  @Post("payments/:id/reject") @ApiOperation({ summary: "Reject payment" })
  rejectPayment(@Param("id") id: string, @Body() body: any) { return this.svc.rejectPayment(id, body.adminNote); }

  // Couriers
  @Get("couriers") @ApiOperation({ summary: "All couriers" })
  getCouriers() { return this.svc.getCouriers(); }
  @Post("couriers") @ApiOperation({ summary: "Create courier" })
  createCourier(@Body() body: any) { return this.svc.createCourier(body); }
  @Put("couriers/:id") @ApiOperation({ summary: "Update courier" })
  updateCourier(@Param("id") id: string, @Body() body: any) { return this.svc.updateCourier(id, body); }
  @Delete("couriers/:id") @ApiOperation({ summary: "Delete courier" })
  deleteCourier(@Param("id") id: string) { return this.svc.deleteCourier(id); }

  // Wilayas
  @Get("wilayas") @ApiOperation({ summary: "All wilayas" })
  getWilayas() { return this.svc.getWilayas(); }
  @Put("wilayas/:id") @ApiOperation({ summary: "Update wilaya" })
  updateWilaya(@Param("id") id: string, @Body() body: any) { return this.svc.updateWilaya(id, body); }

  // Coupons
  @Get("coupons") @ApiOperation({ summary: "All coupons" })
  getCoupons() { return this.svc.getCoupons(); }
  @Post("coupons") @ApiOperation({ summary: "Create coupon" })
  createCoupon(@Body() body: any) { return this.svc.createCoupon(body); }
  @Put("coupons/:id") @ApiOperation({ summary: "Update coupon" })
  updateCoupon(@Param("id") id: string, @Body() body: any) { return this.svc.updateCoupon(id, body); }
  @Delete("coupons/:id") @ApiOperation({ summary: "Delete coupon" })
  deleteCoupon(@Param("id") id: string) { return this.svc.deleteCoupon(id); }
}
