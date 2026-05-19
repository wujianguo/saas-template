import { ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Test } from "@nestjs/testing"

import { AuthService } from "../auth.service"
import { ApiKeyGuard } from "./api-key.guard"

// Prevent Jest from loading better-auth ESM deps by mocking auth.service entirely
jest.mock("../auth.service", () => {
  return {
    AuthService: class AuthService {
      verifyApiKey = jest.fn()
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

describe("ApiKeyGuard", () => {
  let guard: ApiKeyGuard
  let mockVerifyApiKey: jest.Mock

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiKeyGuard, AuthService],
    }).compile()

    guard = module.get<ApiKeyGuard>(ApiKeyGuard)
    const authService = module.get<AuthService>(AuthService)
    mockVerifyApiKey = authService.verifyApiKey as jest.Mock
    mockVerifyApiKey.mockReset()
  })

  it("throws 401 when no x-api-key header is present", async () => {
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      UnauthorizedException
    )
    expect(mockVerifyApiKey).not.toHaveBeenCalled()
  })

  it("throws 401 when the key is invalid", async () => {
    mockVerifyApiKey.mockResolvedValue({
      valid: false,
      key: null,
      error: { code: "INVALID_API_KEY", message: "Invalid key" },
    })
    await expect(
      guard.canActivate(makeContext({ "x-api-key": "bad-key" }))
    ).rejects.toThrow(UnauthorizedException)
  })

  it("attaches apiKey to request when key is valid", async () => {
    const key = { id: "k1", referenceId: "u1", key: "hashed" }
    mockVerifyApiKey.mockResolvedValue({ valid: true, key, error: null })

    const ctx = makeContext({ "x-api-key": "valid-key" })
    const result = await guard.canActivate(ctx)

    expect(result).toBe(true)
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    expect(request.apiKey).toEqual(key)
    expect(request.authenticated).toBe(true)
  })
})
