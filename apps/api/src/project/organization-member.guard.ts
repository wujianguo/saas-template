import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import type { IncomingMessage } from "node:http"

import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      IncomingMessage & {
        params?: { organizationId?: string }
        user?: { id?: unknown }
      }
    >()

    const organizationId = request.params?.organizationId
    const userId = request.user?.id

    if (!organizationId || typeof userId !== "string") {
      throw new ForbiddenException("Organization membership required")
    }

    const membership = await this.prisma.member.findFirst({
      where: { organizationId, userId },
    })

    if (!membership) {
      throw new ForbiddenException("Organization membership required")
    }

    return true
  }
}
