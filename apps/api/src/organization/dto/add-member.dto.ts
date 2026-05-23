import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNotEmpty, IsString } from "class-validator"

import { ORGANIZATION_ROLES, type OrganizationRole } from "../organization-roles"

export class AddMemberDto {
  @ApiProperty({ description: "User ID to add as member" })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: "Role to assign to the member",
    enum: ORGANIZATION_ROLES,
    example: "member",
  })
  @IsIn(ORGANIZATION_ROLES)
  @IsNotEmpty()
  role: OrganizationRole
}
