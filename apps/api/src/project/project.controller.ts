import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger"

import { SessionGuard } from "../auth/guards/session.guard"
import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { ProjectService } from "./project.service"

@ApiTags("Projects")
@ApiCookieAuth("session")
@ApiSecurity("api-key")
@UseGuards(SessionGuard)
@Controller("organizations/:organizationId/projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: "Create a project in the organization" })
  create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateProjectDto
  ) {
    return this.projectService.create(organizationId, dto)
  }

  @Get()
  @ApiOperation({ summary: "List projects in the organization" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  list(
    @Param("organizationId") organizationId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.projectService.list(
      organizationId,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined
    )
  }

  @Get(":projectId")
  @ApiOperation({ summary: "Get a project by ID" })
  async get(
    @Param("organizationId") organizationId: string,
    @Param("projectId") projectId: string
  ) {
    const project = await this.projectService.get(organizationId, projectId)
    if (!project) throw new NotFoundException("Project not found")
    return project
  }

  @Patch(":projectId")
  @ApiOperation({ summary: "Update a project" })
  update(
    @Param("organizationId") organizationId: string,
    @Param("projectId") projectId: string,
    @Body() dto: UpdateProjectDto
  ) {
    return this.projectService.update(organizationId, projectId, dto)
  }

  @Delete(":projectId")
  @ApiOperation({ summary: "Delete a project" })
  remove(
    @Param("organizationId") organizationId: string,
    @Param("projectId") projectId: string
  ) {
    return this.projectService.delete(organizationId, projectId)
  }
}
