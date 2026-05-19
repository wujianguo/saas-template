import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"

import { PrismaService } from "../prisma/prisma.service"
import type { CreateProjectDto } from "./dto/create-project.dto"
import type { UpdateProjectDto } from "./dto/update-project.dto"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateProjectDto) {
    const slug = dto.slug ?? toSlug(dto.name)
    try {
      return await this.prisma.project.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          organizationId,
        },
      })
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new ConflictException(
          `A project with slug "${slug}" already exists in this organization`
        )
      }
      throw err
    }
  }

  list(
    organizationId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit
    return this.prisma.project.findMany({
      where: { organizationId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })
  }

  async get(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId },
    })
    if (!project) throw new NotFoundException("Project not found")
    return project
  }

  async update(
    organizationId: string,
    projectId: string,
    dto: UpdateProjectDto
  ) {
    await this.get(organizationId, projectId)
    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: dto,
      })
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new ConflictException(
          `A project with slug "${dto.slug}" already exists in this organization`
        )
      }
      throw err
    }
  }

  async delete(organizationId: string, projectId: string) {
    await this.get(organizationId, projectId)
    return this.prisma.project.delete({ where: { id: projectId } })
  }
}
