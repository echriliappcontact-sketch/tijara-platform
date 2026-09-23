import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://tijara-platform.vercel.app",
      "https://tijara-platform-echriliappcontact.vercel.app",
      /.vercel.app$/,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("Tijara API")
    .setDescription("Algerian E-Commerce Platform API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log("API: http://localhost:" + port + "/api/v1");
  console.log("Docs: http://localhost:" + port + "/api/v1/docs");
}

bootstrap();
