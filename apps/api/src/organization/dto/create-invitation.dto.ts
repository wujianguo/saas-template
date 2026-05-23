import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsIn, IsNotEmpty } from "class-validator"

import { ORGANIZATION_ROLES, type OrganizationRole } from "../organization-roles"

export class CreateInvitationDto {
  @ApiProperty({ description: "Email address of the user to invite" })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "Role to assign to the invited user",
    enum: ORGANIZATION_ROLES,
    example: "member",
  })
  @IsIn(ORGANIZATION_ROLES)
  @IsNotEmpty()
  role: OrganizationRole
}
