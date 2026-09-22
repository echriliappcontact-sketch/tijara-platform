import { Module } from "@nestjs/common";
import { CouriersService } from "./couriers.service";
import { CouriersController } from "./couriers.controller";
import { PrismaModule } from "../../prisma/prisma.module";
@Module({ imports: [PrismaModule], controllers: [CouriersController], providers: [CouriersService] })
export class CouriersModule {}
