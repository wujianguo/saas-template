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
import { CreateOrganizationDto } from "./dto/create-organization.dto"
import { UpdateOrganizationDto } from "./dto/update-organization.dto"
import { OrganizationService } from "./organization.service"

@ApiTags("Organizations")
@ApiCookieAuth("session")
@ApiSecurity("api-key")
@UseGuards(SessionGuard)
@Controller("organizations")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new organization" })
  create(
    @Body() dto: CreateOrganizationDto,
    @Req() req: IncomingMessage
  ) {
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
}
