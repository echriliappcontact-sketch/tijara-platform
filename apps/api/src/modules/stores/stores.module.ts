import { Module } from "@nestjs/common";
import { StoresService } from "./stores.service";
import { StoresController } from "./stores.controller";
import { CategoriesService } from "./categories.service";
import { PrismaModule } from "../../prisma/prisma.module";

class CategoriesController {
  constructor(private svc: CategoriesService) {}
}

@Module({
  imports: [PrismaModule],
  controllers: [StoresController],
  providers: [StoresService, CategoriesService],
  exports: [StoresService, CategoriesService],
})
export class StoresModule {}