import { type INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { HELLO_MESSAGE } from "@workspace/api"
import request from "supertest"

import { AppModule } from "../src/app.module"
import { AuthService } from "../src/auth/auth.service"
import { PrismaService } from "../src/prisma/prisma.service"

// Prevent loading better-auth ESM modules in Jest
jest.mock("../src/auth/auth.service", () => ({
  AuthService: class AuthService {
    getSession = jest.fn().mockResolvedValue(null)
    verifyApiKey = jest.fn().mockResolvedValue({ valid: false, key: null })
    toHeaders = jest.fn().mockReturnValue(new Headers())
    auth = {
      handler: async () => new Response("", { status: 404 }),
      api: {
        getSession: jest.fn().mockResolvedValue(null),
        verifyApiKey: jest.fn().mockResolvedValue({ valid: false, key: null }),
      },
    }
  },
}))

describe("AppController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile()

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
