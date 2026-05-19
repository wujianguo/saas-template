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
      },
    }
  },
}))

const mockProject = {
  id: "proj-1",
  name: "Alpha",
  slug: "alpha",
  description: null,
  organizationId: "org-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function buildPrismaMock() {
  return {
    project: {
      create: jest.fn().mockResolvedValue(mockProject),
      findMany: jest.fn().mockResolvedValue([mockProject]),
      findFirst: jest.fn().mockResolvedValue(mockProject),
      findUnique: jest.fn().mockResolvedValue(mockProject),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockProject, name: "Alpha Updated" }),
      delete: jest.fn().mockResolvedValue(mockProject),
    },
  }
}

describe("ProjectController (e2e)", () => {
  let app: INestApplication
  let prismaMock: ReturnType<typeof buildPrismaMock>

  beforeEach(async () => {
    prismaMock = buildPrismaMock()

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
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

  it("POST /organizations/:orgId/projects — creates a project", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations/org-1/projects")
      .set("Cookie", "session=tok")
      .send({ name: "Alpha" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "proj-1", name: "Alpha", slug: "alpha" })
      })
  })

  it("POST /organizations/:orgId/projects — rejects missing name with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations/org-1/projects")
      .set("Cookie", "session=tok")
      .send({ slug: "no-name" })
      .expect(400)
  })

  it("POST /organizations/:orgId/projects — rejects invalid slug with 400", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations/org-1/projects")
      .set("Cookie", "session=tok")
      .send({ name: "Test", slug: "Invalid Slug!" })
      .expect(400)
  })

  it("GET /organizations/:orgId/projects — lists projects", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1/projects")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toMatchObject({ id: "proj-1" })
      })
  })

  it("GET /organizations/:orgId/projects/:projectId — returns project", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1/projects/proj-1")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "proj-1" })
      })
  })

  it("GET /organizations/:orgId/projects/:projectId — returns 404 for non-existent project", async () => {
    prismaMock.project.findFirst.mockResolvedValueOnce(null)
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1/projects/nonexistent")
      .set("Cookie", "session=tok")
      .expect(404)
  })

  it("PATCH /organizations/:orgId/projects/:projectId — updates project", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .patch("/organizations/org-1/projects/proj-1")
      .set("Cookie", "session=tok")
      .send({ name: "Alpha Updated" })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ name: "Alpha Updated" })
      })
  })

  it("DELETE /organizations/:orgId/projects/:projectId — deletes project", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .delete("/organizations/org-1/projects/proj-1")
      .set("Cookie", "session=tok")
      .expect(200)
  })
})
