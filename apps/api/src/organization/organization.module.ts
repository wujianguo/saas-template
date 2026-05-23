import { Module } from "@nestjs/common"

import { InvitationController } from "./invitation.controller"
import { OrganizationController } from "./organization.controller"
import { OrganizationService } from "./organization.service"

@Module({
  controllers: [OrganizationController, InvitationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
