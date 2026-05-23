import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common"
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { IncomingMessage } from "node:http"

import { SessionGuard } from "../auth/guards/session.guard"
import { OrganizationService } from "../organization/organization.service"

@ApiTags("Invitations")
@ApiCookieAuth("session")
@UseGuards(SessionGuard)
@Controller("invitations")
export class InvitationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post(":id/accept")
  @ApiOperation({ summary: "Accept an invitation" })
  accept(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.orgService.acceptInvitation(id, req.headers)
  }
}
