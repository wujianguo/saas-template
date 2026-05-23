import { Injectable, NotFoundException } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"

import { AuthService } from "../auth/auth.service"
import { PrismaService } from "../prisma/prisma.service"
import type { CreateTeamDto } from "./dto/create-team.dto"
import type { UpdateTeamDto } from "./dto/update-team.dto"

@Injectable()
export class TeamService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  private async ensureTeamInOrganization(teamId: string, organizationId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId },
    })

    if (!team) {
      throw new NotFoundException("Team not found")
    }
  }

  create(organizationId: string, dto: CreateTeamDto, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.createTeam({
      body: { organizationId, ...dto },
      headers,
    })
  }

  list(organizationId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listOrganizationTeams({
      query: { organizationId },
      headers,
    })
  }

  async update(
    organizationId: string,
    teamId: string,
    dto: UpdateTeamDto,
    rawHeaders: IncomingHttpHeaders
  ) {
    await this.ensureTeamInOrganization(teamId, organizationId)
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.updateTeam({
      body: { teamId, ...dto },
      headers,
    })
  }

  async remove(
    organizationId: string,
    teamId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    await this.ensureTeamInOrganization(teamId, organizationId)
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.removeTeam({ body: { teamId }, headers })
  }

  async addMember(
    organizationId: string,
    teamId: string,
    userId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    await this.ensureTeamInOrganization(teamId, organizationId)
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.addTeamMember({
      body: { teamId, userId },
      headers,
    })
  }

  async removeMember(
    organizationId: string,
    teamId: string,
    userId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    await this.ensureTeamInOrganization(teamId, organizationId)
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.removeTeamMember({
      body: { teamId, userId },
      headers,
    })
  }

  async listMembers(
    organizationId: string,
    teamId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    await this.ensureTeamInOrganization(teamId, organizationId)
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listTeamMembers({
      query: { teamId },
      headers,
    })
  }
}
