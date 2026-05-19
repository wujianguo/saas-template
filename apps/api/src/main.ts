import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
  )

  const config = new DocumentBuilder()
    .setTitle("SaaS Template API")
    .setVersion("1.0")
    .addCookieAuth("session")
    .addApiKey({ type: "apiKey", in: "header", name: "x-api-key" }, "api-key")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  await app.listen(process.env.PORT ?? 3001)
}

void bootstrap()
