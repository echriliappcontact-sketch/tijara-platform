import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PublicService } from "./public.service";
@ApiTags("Public Storefront") @Controller("public")
export class PublicController {
  constructor(private svc: PublicService) {}
  @Get("stores/:slug") @ApiOperation({ summary: "Get store by slug" }) getStore(@Param("slug") slug: string) { return this.svc.getStoreBySlug(slug); }
  @Get("wilayas") @ApiOperation({ summary: "Get all wilayas" }) getWilayas() { return this.svc.getWilayas(); }
}
