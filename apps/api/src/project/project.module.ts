import { Module } from "@nestjs/common"

import { OrganizationMemberGuard } from "./organization-member.guard"
import { ProjectController } from "./project.controller"
import { ProjectService } from "./project.service"

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, OrganizationMemberGuard],
})
export class ProjectModule {}
