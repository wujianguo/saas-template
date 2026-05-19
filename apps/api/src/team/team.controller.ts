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
import { CreateTeamDto } from "./dto/create-team.dto"
import { UpdateTeamDto } from "./dto/update-team.dto"
import { TeamService } from "./team.service"

@ApiTags("Teams")
@ApiCookieAuth("session")
@ApiSecurity("api-key")
@UseGuards(SessionGuard)
@Controller("organizations/:organizationId/teams")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: "Create a team in the organization" })
  create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateTeamDto,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.create(organizationId, dto, req.headers)
  }

  @Get()
  @ApiOperation({ summary: "List teams in the organization" })
  list(
    @Param("organizationId") organizationId: string,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.list(organizationId, req.headers)
  }

  @Patch(":teamId")
  @ApiOperation({ summary: "Update team name" })
  update(
    @Param("organizationId") _organizationId: string,
    @Param("teamId") teamId: string,
    @Body() dto: UpdateTeamDto,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.update(teamId, dto, req.headers)
  }

  @Delete(":teamId")
  @ApiOperation({ summary: "Delete a team" })
  remove(
    @Param("organizationId") _organizationId: string,
    @Param("teamId") teamId: string,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.remove(teamId, req.headers)
  }

  @Post(":teamId/members")
  @ApiOperation({ summary: "Add a user to the team" })
  addMember(
    @Param("organizationId") _organizationId: string,
    @Param("teamId") teamId: string,
    @Body("userId") userId: string,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.addMember(teamId, userId, req.headers)
  }

  @Delete(":teamId/members/:userId")
  @ApiOperation({ summary: "Remove a user from the team" })
  removeMember(
    @Param("organizationId") _organizationId: string,
    @Param("teamId") teamId: string,
    @Param("userId") userId: string,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.removeMember(teamId, userId, req.headers)
  }

  @Get(":teamId/members")
  @ApiOperation({ summary: "List team members" })
  listMembers(
    @Param("organizationId") _organizationId: string,
    @Param("teamId") teamId: string,
    @Req() req: IncomingMessage
  ) {
    return this.teamService.listMembers(teamId, req.headers)
  }
}
