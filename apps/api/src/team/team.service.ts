import { Injectable } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"

import { AuthService } from "../auth/auth.service"
import type { CreateTeamDto } from "./dto/create-team.dto"
import type { UpdateTeamDto } from "./dto/update-team.dto"

@Injectable()
export class TeamService {
  constructor(private readonly authService: AuthService) {}

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

  update(teamId: string, dto: UpdateTeamDto, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.updateTeam({
      body: { teamId, ...dto },
      headers,
    })
  }

  remove(teamId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.removeTeam({ body: { teamId }, headers })
  }

  addMember(teamId: string, userId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.addTeamMember({
      body: { teamId, userId },
      headers,
    })
  }

  removeMember(teamId: string, userId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.removeTeamMember({
      body: { teamId, userId },
      headers,
    })
  }

  listMembers(teamId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listTeamMembers({
      query: { teamId },
      headers,
    })
  }
}
