import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import {
  ApiCookieAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger"
import type { IncomingMessage } from "node:http"

import { SessionGuard } from "../auth/guards/session.guard"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateInvitationDto } from "./dto/create-invitation.dto"
import { CreateOrganizationDto } from "./dto/create-organization.dto"
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto"
import { UpdateOrganizationDto } from "./dto/update-organization.dto"
import { OrganizationService } from "./organization.service"

@ApiTags("Organizations")
@ApiCookieAuth("session")
@ApiSecurity("api-key")
@UseGuards(SessionGuard)
@Controller("organizations")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  // ─── Organization CRUD ────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: "Create a new organization" })
  create(@Body() dto: CreateOrganizationDto, @Req() req: IncomingMessage) {
    return this.orgService.create(dto, req.headers)
  }

  @Get()
  @ApiOperation({ summary: "List organizations for current user" })
  list(@Req() req: IncomingMessage) {
    return this.orgService.list(req.headers)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get full organization details" })
  getFull(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.orgService.getFull(id, req.headers)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update organization" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateOrganizationDto,
    @Req() req: IncomingMessage
  ) {
    return this.orgService.update(id, dto, req.headers)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete organization" })
  remove(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.orgService.delete(id, req.headers)
  }

  // ─── Members ──────────────────────────────────────────────────────────────

  @Post(":id/members")
  @ApiOperation({ summary: "Add a member to the organization" })
  addMember(
    @Param("id") id: string,
    @Body() dto: AddMemberDto,
    @Req() req: IncomingMessage
  ) {
    return this.orgService.addMember(id, dto, req.headers)
  }

  @Get(":id/members")
  @ApiOperation({ summary: "List organization members" })
  listMembers(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.orgService.listMembers(id, req.headers)
  }

  @Patch(":id/members/:memberId")
  @ApiOperation({ summary: "Update member role" })
  updateMemberRole(
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Req() req: IncomingMessage
  ) {
    return this.orgService.updateMemberRole(id, memberId, dto, req.headers)
  }

  @Delete(":id/members/:memberId")
  @ApiOperation({ summary: "Remove a member from the organization" })
  removeMember(
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @Req() req: IncomingMessage
  ) {
    return this.orgService.removeMember(id, memberId, req.headers)
  }

  // ─── Invitations ──────────────────────────────────────────────────────────

  @Post(":id/invitations")
  @ApiOperation({ summary: "Invite a user to the organization" })
  createInvitation(
    @Param("id") id: string,
    @Body() dto: CreateInvitationDto,
    @Req() req: IncomingMessage
  ) {
    return this.orgService.createInvitation(id, dto, req.headers)
  }

  @Get(":id/invitations")
  @ApiOperation({ summary: "List pending invitations" })
  listInvitations(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.orgService.listInvitations(id, req.headers)
  }

  @Delete(":id/invitations/:invitationId")
  @ApiOperation({ summary: "Cancel a pending invitation" })
  cancelInvitation(
    @Param("id") id: string,
    @Param("invitationId") invitationId: string,
    @Req() req: IncomingMessage
  ) {
    void id
    return this.orgService.cancelInvitation(invitationId, req.headers)
  }
}
