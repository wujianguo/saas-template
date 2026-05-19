import { Injectable } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"

import { AuthService } from "../auth/auth.service"
import type { CreateOrganizationDto } from "./dto/create-organization.dto"
import type { UpdateOrganizationDto } from "./dto/update-organization.dto"

@Injectable()
export class OrganizationService {
  constructor(private readonly authService: AuthService) {}

  create(dto: CreateOrganizationDto, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.createOrganization({
      body: dto,
      headers,
    })
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
}
