import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser());
  app.use(compression());
  app.enableCors({ origin: "*", credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder().setTitle("Tijara API").setDescription("Algerian E-Commerce Platform API").setVersion("1.0").addBearerAuth().build();
  SwaggerModule.setup("api/v1/docs", app, SwaggerModule.createDocument(app, config));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log("API: http://localhost:" + port + "/api/v1");
  console.log("Docs: http://localhost:" + port + "/api/v1/docs");
}
bootstrap();
