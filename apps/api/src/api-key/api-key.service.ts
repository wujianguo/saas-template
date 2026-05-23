import { Injectable } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"

import { AuthService } from "../auth/auth.service"
import type { CreateApiKeyDto } from "./dto/create-api-key.dto"
import type { UpdateApiKeyDto } from "./dto/update-api-key.dto"

@Injectable()
export class ApiKeyService {
  constructor(private readonly authService: AuthService) {}

  create(
    dto: CreateApiKeyDto,
    userId: string,
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    const expiresIn = dto.expiresAt
      ? Math.floor(
          (new Date(dto.expiresAt).getTime() - Date.now()) / 1000
        )
      : undefined
    return this.authService.auth.api.createApiKey({
      body: {
        configId: dto.configId,
        name: dto.name,
        userId,
        organizationId: dto.organizationId,
        expiresIn,
        permissions: dto.permissions,
        metadata: dto.metadata,
      },
      headers,
    })
  }

  list(
    query: {
      configId?: string
      organizationId?: string
      limit?: number
      offset?: number
    },
    rawHeaders: IncomingHttpHeaders
  ) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.listApiKeys({ query, headers })
  }

  get(keyId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.getApiKey({
      query: { id: keyId },
      headers,
    })
  }

  update(keyId: string, dto: UpdateApiKeyDto, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.updateApiKey({
      body: { id: keyId, ...dto },
      headers,
    })
  }

  delete(keyId: string, rawHeaders: IncomingHttpHeaders) {
    const headers = this.authService.toHeaders(rawHeaders)
    return this.authService.auth.api.deleteApiKey({
      body: { id: keyId },
      headers,
    })
  }
}
