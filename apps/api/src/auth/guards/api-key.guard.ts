import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import type { IncomingMessage } from "node:http"

import { AuthService } from "../auth.service"

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IncomingMessage & Record<string, unknown>>()

    const headers = request.headers as IncomingMessage["headers"]
    const authorization = headers.authorization
    const authValue = Array.isArray(authorization) ? authorization[0] : authorization
    const key =
      typeof authValue === "string" ? authValue.replace(/^Bearer\s+/i, "").trim() : undefined

    if (!key) {
      throw new UnauthorizedException()
    }

    const result = await this.authService.verifyApiKey(key)

    if (!result.valid || !result.key) {
      throw new UnauthorizedException()
    }

    request.apiKey = result.key
    request.authenticated = true

    return true
  }
}
