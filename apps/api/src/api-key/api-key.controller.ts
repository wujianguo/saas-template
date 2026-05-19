import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common"
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger"
import type { IncomingMessage } from "node:http"

import { SessionGuard } from "../auth/guards/session.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { CreateApiKeyDto } from "./dto/create-api-key.dto"
import { UpdateApiKeyDto } from "./dto/update-api-key.dto"
import { ApiKeyService } from "./api-key.service"

@ApiTags("API Keys")
@ApiCookieAuth("session")
@ApiSecurity("api-key")
@UseGuards(SessionGuard)
@Controller("api-keys")
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({ summary: "Create an API key" })
  create(
    @Body() dto: CreateApiKeyDto,
    @Req() req: IncomingMessage,
    @CurrentUser() user: Record<string, unknown>
  ) {
    return this.apiKeyService.create(dto, user.id as string, req.headers)
  }

  @Get()
  @ApiOperation({ summary: "List API keys" })
  @ApiQuery({ name: "configId", required: false })
  @ApiQuery({ name: "organizationId", required: false })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "offset", required: false, type: Number })
  list(
    @Req() req: IncomingMessage,
    @Query("configId") configId?: string,
    @Query("organizationId") organizationId?: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    return this.apiKeyService.list(
      {
        configId,
        organizationId,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      },
      req.headers
    )
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an API key by ID" })
  get(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.apiKeyService.get(id, req.headers)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an API key" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateApiKeyDto,
    @Req() req: IncomingMessage
  ) {
    return this.apiKeyService.update(id, dto, req.headers)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete (revoke) an API key" })
  remove(@Param("id") id: string, @Req() req: IncomingMessage) {
    return this.apiKeyService.delete(id, req.headers)
  }
}
