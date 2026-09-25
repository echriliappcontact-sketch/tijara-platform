import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { StoresModule } from "./modules/stores/stores.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { AdminModule } from "./modules/admin/admin.module";
import { UploadModule } from "./modules/upload/upload.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StoresModule,
    ProductsModule,
    OrdersModule,
    SubscriptionsModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}