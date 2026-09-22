import { Module } from "@nestjs/common";
import { WilayasService } from "./wilayas.service";
import { WilayasController } from "./wilayas.controller";
import { PrismaModule } from "../../prisma/prisma.module";
@Module({ imports: [PrismaModule], controllers: [WilayasController], providers: [WilayasService] })
export class WilayasModule {}
