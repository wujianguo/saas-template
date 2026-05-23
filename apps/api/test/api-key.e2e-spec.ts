import { ValidationPipe, type INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

// Prevent loading better-auth ESM modules in Jest
jest.mock("../src/auth/auth.service", () => ({
  AuthService: class AuthService {
    getSession = jest.fn().mockResolvedValue({
      user: { id: "u1", email: "owner@example.com", name: "Owner" },
      session: { id: "s1", token: "tok", userId: "u1" },
    })
    verifyApiKey = jest.fn().mockResolvedValue({ valid: false, key: null })
    toHeaders = jest.fn().mockReturnValue(new Headers())
    auth = {
      handler: async () => new Response("", { status: 404 }),
      api: {
        getSession: jest.fn().mockResolvedValue(null),
        verifyApiKey: jest.fn().mockResolvedValue({ valid: false, key: null }),
        createApiKey: jest
          .fn()
          .mockResolvedValue({ id: "k1", key: "saa_abc123", name: "My Key" }),
        listApiKeys: jest
          .fn()
          .mockResolvedValue({ apiKeys: [{ id: "k1", name: "My Key", start: "saa_ab" }] }),
        getApiKey: jest
          .fn()
          .mockResolvedValue({ id: "k1", name: "My Key", start: "saa_ab" }),
        updateApiKey: jest
          .fn()
          .mockResolvedValue({ id: "k1", name: "Updated Key" }),
        deleteApiKey: jest.fn().mockResolvedValue({ success: true }),
      },
    }
  },
}))

describe("ApiKeyController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it("POST /api-keys — creates a user-scoped API key with saa_ prefix", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/api-keys")
      .set("Cookie", "session=tok")
      .send({ name: "My Key", configId: "user" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "k1", key: "saa_abc123" })
      })
  })

  it("POST /api-keys — rejects missing name with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/api-keys")
      .set("Cookie", "session=tok")
      .send({ configId: "user" })
      .expect(400)
  })

  it("POST /api-keys — rejects past expiresAt values with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/api-keys")
      .set("Cookie", "session=tok")
      .send({
        name: "My Key",
        configId: "user",
        expiresAt: "2000-01-01T00:00:00.000Z",
      })
      .expect(400)
  })

  it("GET /api-keys — lists keys (no secret)", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/api-keys")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        const keys = res.body.apiKeys ?? res.body
        const firstKey = Array.isArray(keys) ? keys[0] : keys
        expect(firstKey).not.toHaveProperty("key")
      })
  })

  it("GET /api-keys/:id — returns key metadata (no secret)", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/api-keys/k1")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "k1" })
        expect(res.body).not.toHaveProperty("key")
      })
  })

  it("PATCH /api-keys/:id — updates key metadata", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .patch("/api-keys/k1")
      .set("Cookie", "session=tok")
      .send({ name: "Updated Key" })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ name: "Updated Key" })
      })
  })

  it("DELETE /api-keys/:id — revokes the key", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .delete("/api-keys/k1")
      .set("Cookie", "session=tok")
      .expect(200)
  })
})
