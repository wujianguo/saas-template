import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import type { IncomingMessage } from "node:http"

import { AuthService } from "../auth.service"

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IncomingMessage & Record<string, unknown>>()

    const session = await this.authService.getSession(request.headers)

    if (!session) {
      throw new UnauthorizedException()
    }

    request.user = session.user
    request.session = session.session
    request.authenticated = true

    return true
  }
}
