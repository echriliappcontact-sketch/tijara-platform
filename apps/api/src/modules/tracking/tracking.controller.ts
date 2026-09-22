import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
@ApiTags("Tracking") @Controller("tracking")
export class TrackingController {
  constructor(private svc: TrackingService) {}
  @Get(":orderNumber") @ApiOperation({ summary: "Track order" }) track(@Param("orderNumber") n: string) { return this.svc.track(n); }
}
