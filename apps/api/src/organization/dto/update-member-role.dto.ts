import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNotEmpty } from "class-validator"

import { ORGANIZATION_ROLES, type OrganizationRole } from "../organization-roles"

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: "New role for the member",
    enum: ORGANIZATION_ROLES,
    example: "admin",
  })
  @IsIn(ORGANIZATION_ROLES)
  @IsNotEmpty()
  role: OrganizationRole
}
