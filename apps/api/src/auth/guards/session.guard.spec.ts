import { ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Test } from "@nestjs/testing"

import { AuthService } from "../auth.service"
import { SessionGuard } from "./session.guard"

// Prevent Jest from loading better-auth ESM deps by mocking auth.service entirely
jest.mock("../auth.service", () => {
  return {
    AuthService: class AuthService {
      getSession = jest.fn()
    },
  }
})

function makeContext(headers: Record<string, string> = {}): ExecutionContext {
  const request = { headers } as Record<string, unknown>
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext
}

describe("SessionGuard", () => {
  let guard: SessionGuard
  let mockGetSession: jest.Mock

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SessionGuard, AuthService],
    }).compile()

    guard = module.get<SessionGuard>(SessionGuard)
    const authService = module.get<AuthService>(AuthService)
    mockGetSession = authService.getSession as jest.Mock
    mockGetSession.mockReset()
  })

  it("throws 401 when no session cookie is present", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      UnauthorizedException
    )
  })

  it("throws 401 when session is invalid", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(
      guard.canActivate(makeContext({ cookie: "session=invalid" }))
    ).rejects.toThrow(UnauthorizedException)
  })

  it("attaches user and session to request when session is valid", async () => {
    const user = { id: "u1", email: "test@example.com", name: "Test" }
    const session = { id: "s1", token: "tok", userId: "u1" }
    mockGetSession.mockResolvedValue({ user, session })

    const ctx = makeContext({ cookie: "better-auth.session_token=tok" })
    const result = await guard.canActivate(ctx)

    expect(result).toBe(true)
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    expect(request.user).toEqual(user)
    expect(request.session).toEqual(session)
    expect(request.authenticated).toBe(true)
  })
})
