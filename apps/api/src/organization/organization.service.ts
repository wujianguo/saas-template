import { Injectable, NotFoundException } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"

import { AuthService } from "../auth/auth.service"
import { PrismaService } from "../prisma/prisma.service"
import type { AddMemberDto } from "./dto/add-member.dto"
import type { CreateInvitationDto } from "./dto/create-invitation.dto"
import type { CreateOrganizationDto } from "./dto/create-organization.dto"
import type { UpdateMemberRoleDto } from "./dto/update-member-role.dto"
import type { UpdateOrganizationDto } from "./dto/update-organization.dto"

@Injectable()
export class OrganizationService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  // ─── Organization CRUD ────────────────────────────────────────────────────

  create(dto: CreateOrganizationDto, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.createOrganization({ body: dto, headers })
  }

  list(rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listOrganizations({ headers })
  }

  getFull(organizationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.getFullOrganization({
      query: { organizationId },
      headers,
    })
  }

  update(
    organizationId: string,
    dto: UpdateOrganizationDto,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.updateOrganization({
      body: { organizationId, ...dto },
      headers,
    })
  }

  delete(organizationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.deleteOrganization({
      body: { organizationId },
      headers,
    })
  }

  // ─── Members ──────────────────────────────────────────────────────────────

  addMember(
    organizationId: string,
    dto: AddMemberDto,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.addMember({
      body: { organizationId, userId: dto.userId, role: dto.role },
      headers,
    })
  }

  listMembers(organizationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listMembers({
      query: { organizationId },
      headers,
    })
  }

  removeMember(
    organizationId: string,
    memberId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.removeMember({
      body: { memberIdOrEmail: memberId, organizationId },
      headers,
    })
  }

  updateMemberRole(
    organizationId: string,
    memberId: string,
    dto: UpdateMemberRoleDto,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.updateMemberRole({
      body: { memberId, role: dto.role, organizationId },
      headers,
    })
  }

  // ─── Invitations ──────────────────────────────────────────────────────────

  createInvitation(
    organizationId: string,
    dto: CreateInvitationDto,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.createInvitation({
      body: { email: dto.email, role: dto.role, organizationId },
      headers,
    })
  }

  listInvitations(organizationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listInvitations({
      query: { organizationId },
      headers,
    })
  }

  async cancelInvitation(
    organizationId: string,
    invitationId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    const invitation = await this.prisma.invitation.findFirst({
      where: { id: invitationId, organizationId },
    })

    if (!invitation) {
      throw new NotFoundException("Invitation not found")
    }

    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.cancelInvitation({
      body: { invitationId },
      headers,
    })
  }

  acceptInvitation(invitationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.acceptInvitation({
      body: { invitationId },
      headers,
    })
  }
}
