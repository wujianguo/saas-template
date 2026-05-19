import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import express from "express"
import { toNodeHandler } from "better-auth/node"
import type { IncomingMessage, ServerResponse } from "node:http"

import { AppModule } from "./app.module"
import { AuthService } from "./auth/auth.service"

async function bootstrap() {
  // Disable NestJS body parser so Better Auth can read the raw request body
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  app.enableCors()

  // Mount Better Auth handler BEFORE body parser so OAuth callbacks get the raw body
  const authService = app.get(AuthService)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const authHandler = toNodeHandler(authService.auth)
  const expressApp = app.getHttpAdapter().getInstance() as import("express").Express
  expressApp.use(
    (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url?.startsWith("/api/auth")) {
        return authHandler(req, res)
      }
      next()
    }
  )

  // Re-enable body parsing for NestJS routes
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

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
