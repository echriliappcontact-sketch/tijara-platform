import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { StoresModule } from "./modules/stores/stores.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { UsersModule } from "./modules/users/users.module";
import { WilayasModule } from "./modules/wilayas/wilayas.module";
import { AdminModule } from "./modules/admin/admin.module";
import { CouriersModule } from "./modules/couriers/couriers.module";
import { PublicModule } from "./modules/public/public.module";
import { TrackingModule } from "./modules/tracking/tracking.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule, StoresModule, ProductsModule, OrdersModule,
    UsersModule, WilayasModule, AdminModule, CouriersModule, PublicModule,
    TrackingModule, UploadsModule, AnalyticsModule,
  ],
})
export class AppModule {}
