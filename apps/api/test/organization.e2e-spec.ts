import { ValidationPipe, type INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
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
        createOrganization: jest.fn(),
        listOrganizations: jest.fn(),
        getFullOrganization: jest.fn(),
        updateOrganization: jest.fn(),
        deleteOrganization: jest.fn(),
      },
    }
  },
}))

const mockOrg = {
  id: "org-1",
  name: "Acme Corp",
  slug: "acme-corp",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function buildAuthServiceMock() {
  return {
    getSession: jest.fn().mockResolvedValue({
      user: { id: "u1", email: "owner@example.com", name: "Owner" },
      session: { id: "s1", token: "tok", userId: "u1" },
    }),
    toHeaders: jest.fn().mockReturnValue(new Headers()),
    auth: {
      handler: async () => new Response("", { status: 404 }),
      api: {
        getSession: jest.fn().mockResolvedValue(null),
        verifyApiKey: jest.fn().mockResolvedValue({ valid: false, key: null }),
        createOrganization: jest.fn().mockResolvedValue(mockOrg),
        listOrganizations: jest.fn().mockResolvedValue([mockOrg]),
        getFullOrganization: jest
          .fn()
          .mockResolvedValue({ ...mockOrg, members: [], teams: [] }),
        updateOrganization: jest
          .fn()
          .mockResolvedValue({ ...mockOrg, name: "Acme Corp Updated" }),
        deleteOrganization: jest.fn().mockResolvedValue(mockOrg),
      },
    },
  }
}

describe("OrganizationController (e2e)", () => {
  let app: INestApplication
  let authServiceMock: ReturnType<typeof buildAuthServiceMock>

  beforeEach(async () => {
    authServiceMock = buildAuthServiceMock()

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
    )
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it("POST /organizations — creates an organization", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations")
      .set("Cookie", "session=tok")
      .send({ name: "Acme Corp", slug: "acme-corp" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "org-1", name: "Acme Corp" })
      })
    expect(authServiceMock.auth.api.createOrganization).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ name: "Acme Corp" }),
      })
    )
  })

  it("POST /organizations — rejects missing name with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations")
      .set("Cookie", "session=tok")
      .send({ slug: "no-name" })
      .expect(400)
  })

  it("POST /organizations — rejects extra fields with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations")
      .set("Cookie", "session=tok")
      .send({ name: "Test", extra: "field" })
      .expect(400)
  })

  it("GET /organizations — lists organizations", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toMatchObject({ id: "org-1" })
      })
  })

  it("GET /organizations/:id — returns full org", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "org-1", members: [] })
      })
  })

  it("PATCH /organizations/:id — updates organization", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .patch("/organizations/org-1")
      .set("Cookie", "session=tok")
      .send({ name: "Acme Corp Updated" })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ name: "Acme Corp Updated" })
      })
  })

  it("DELETE /organizations/:id — deletes organization", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .delete("/organizations/org-1")
      .set("Cookie", "session=tok")
      .expect(200)
  })

  it("GET /organizations — returns 401 without session", async () => {
    authServiceMock.getSession.mockResolvedValueOnce(null)
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server).get("/organizations").expect(401)
  })
})
