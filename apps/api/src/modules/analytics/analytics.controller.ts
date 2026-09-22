import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
@ApiTags("Analytics") @Controller("analytics")
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}
  @Get("dashboard") @ApiOperation({ summary: "Dashboard stats" }) getDashboard() { return this.svc.getDashboard(); }
}
