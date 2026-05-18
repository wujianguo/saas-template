import { type INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { HELLO_MESSAGE } from "@workspace/api"
import request from "supertest"

import { AppModule } from "../src/app.module"

describe("AppController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it("/ (GET)", () => {
    const httpServer = app.getHttpServer() as unknown as Parameters<typeof request>[0]

    return request(httpServer)
      .get("/")
      .expect(200)
      .expect({ message: HELLO_MESSAGE })
  })
})
