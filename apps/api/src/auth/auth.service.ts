import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { apiKey } from "@better-auth/api-key"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { genericOAuth, organization } from "better-auth/plugins"
import { betterAuth } from "better-auth"
import { fromNodeHeaders } from "better-auth/node"
import { Resend } from "resend"
import type { IncomingHttpHeaders } from "node:http"

import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AuthService {
  // Better Auth instance - typed as any to preserve full plugin API inference
  auth: any

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    const resendApiKey = this.config.get<string>("RESEND_API_KEY")
    const resend = resendApiKey ? new Resend(resendApiKey) : null

    const githubClientId = this.config.get<string>("GITHUB_CLIENT_ID") ?? ""
    const githubClientSecret = this.config.get<string>("GITHUB_CLIENT_SECRET") ?? ""
    const gitlabClientId = this.config.get<string>("GITLAB_CLIENT_ID") ?? ""
    const gitlabClientSecret = this.config.get<string>("GITLAB_CLIENT_SECRET") ?? ""

    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, { provider: "postgresql" }),
      secret: this.config.get<string>("BETTER_AUTH_SECRET"),
      baseURL:
        this.config.get<string>("BETTER_AUTH_URL") ?? "http://localhost:3001",
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }: { user: { email?: string }, url: string }) => {
          if (!resend || !user.email) return
          await resend.emails.send({
            from: "noreply@example.com",
            to: user.email,
            subject: "Verify your email",
            html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
          })
        },
      },
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        github: {
          clientId: githubClientId,
          clientSecret: githubClientSecret,
        },
      },
      plugins: [
        genericOAuth({
          config: [
            {
              providerId: "gitlab",
              authorizationUrl: "https://gitlab.com/oauth/authorize",
              tokenUrl: "https://gitlab.com/oauth/token",
              userInfoUrl: "https://gitlab.com/api/v4/user",
              clientId: gitlabClientId,
              clientSecret: gitlabClientSecret,
              scopes: ["read_user"],
            },
          ],
        }),
        organization({
          allowUserToCreateOrganization: true,
          teams: { enabled: true },
        }),
        apiKey(),
      ],
    })
  }

  getSession(headers: IncomingHttpHeaders) {
    return this.auth.api.getSession({ headers: fromNodeHeaders(headers) }) as Promise<{
      user: Record<string, unknown>
      session: Record<string, unknown>
    } | null>
  }

  verifyApiKey(key: string) {
    return this.auth.api.verifyApiKey({ body: { key } }) as Promise<{
      valid: boolean
      key: Record<string, unknown> | null
      error: unknown
    }>
  }

  toHeaders(headers: IncomingHttpHeaders): Headers {
    return fromNodeHeaders(headers)
  }
}
