import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || "secret", signOptions: { expiresIn: "7d" } })],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
