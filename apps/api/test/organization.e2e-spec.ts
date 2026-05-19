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
        addMember: jest.fn(),
        listMembers: jest.fn(),
        removeMember: jest.fn(),
        updateMemberRole: jest.fn(),
        createInvitation: jest.fn(),
        listInvitations: jest.fn(),
        cancelInvitation: jest.fn(),
        acceptInvitation: jest.fn(),
        createTeam: jest.fn(),
        listOrganizationTeams: jest.fn(),
        updateTeam: jest.fn(),
        removeTeam: jest.fn(),
        addTeamMember: jest.fn(),
        removeTeamMember: jest.fn(),
        listTeamMembers: jest.fn(),
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

const mockMember = { id: "m1", userId: "u1", role: "member", organizationId: "org-1" }
const mockInvitation = { id: "inv-1", email: "new@example.com", role: "member", organizationId: "org-1", status: "pending" }
const mockTeam = { id: "t1", name: "Engineering", organizationId: "org-1" }

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
          .mockResolvedValue({ ...mockOrg, members: [mockMember], teams: [mockTeam] }),
        updateOrganization: jest
          .fn()
          .mockResolvedValue({ ...mockOrg, name: "Acme Corp Updated" }),
        deleteOrganization: jest.fn().mockResolvedValue(mockOrg),
        addMember: jest.fn().mockResolvedValue(mockMember),
        listMembers: jest.fn().mockResolvedValue([mockMember]),
        removeMember: jest.fn().mockResolvedValue({ success: true }),
        updateMemberRole: jest.fn().mockResolvedValue({ ...mockMember, role: "admin" }),
        createInvitation: jest.fn().mockResolvedValue(mockInvitation),
        listInvitations: jest.fn().mockResolvedValue([mockInvitation]),
        cancelInvitation: jest.fn().mockResolvedValue({ success: true }),
        acceptInvitation: jest.fn().mockResolvedValue({ ...mockInvitation, status: "accepted" }),
        createTeam: jest.fn().mockResolvedValue(mockTeam),
        listOrganizationTeams: jest.fn().mockResolvedValue([mockTeam]),
        updateTeam: jest.fn().mockResolvedValue({ ...mockTeam, name: "Platform" }),
        removeTeam: jest.fn().mockResolvedValue({ success: true }),
        addTeamMember: jest.fn().mockResolvedValue({ teamId: "t1", userId: "u2" }),
        removeTeamMember: jest.fn().mockResolvedValue({ success: true }),
        listTeamMembers: jest.fn().mockResolvedValue([{ userId: "u1" }]),
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
        expect(res.body).toMatchObject({ id: "org-1", members: expect.any(Array) })
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

  it("POST /organizations/:id/members — adds a member", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations/org-1/members")
      .set("Cookie", "session=tok")
      .send({ userId: "u2", role: "member" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "m1" })
      })
  })

  it("GET /organizations/:id/members — lists members", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1/members")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toMatchObject({ id: "m1" })
      })
  })

  it("PATCH /organizations/:id/members/:memberId — updates member role", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .patch("/organizations/org-1/members/m1")
      .set("Cookie", "session=tok")
      .send({ role: "admin" })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ role: "admin" })
      })
  })

  it("DELETE /organizations/:id/members/:memberId — removes member", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .delete("/organizations/org-1/members/m1")
      .set("Cookie", "session=tok")
      .expect(200)
  })

  it("POST /organizations/:id/invitations — invites a user", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/organizations/org-1/invitations")
      .set("Cookie", "session=tok")
      .send({ email: "new@example.com", role: "member" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: "inv-1", email: "new@example.com" })
      })
  })

  it("GET /organizations/:id/invitations — lists invitations", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .get("/organizations/org-1/invitations")
      .set("Cookie", "session=tok")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toMatchObject({ id: "inv-1" })
      })
  })

  it("DELETE /organizations/:id/invitations/:invitationId — cancels invitation", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .delete("/organizations/org-1/invitations/inv-1")
      .set("Cookie", "session=tok")
      .expect(200)
  })

  it("POST /invitations/:id/accept — accepts invitation", async () => {
    const server = app.getHttpServer() as unknown as Parameters<typeof request>[0]
    await request(server)
      .post("/invitations/inv-1/accept")
      .set("Cookie", "session=tok")
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ status: "accepted" })
      })
  })
})
