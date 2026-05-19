import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateInvitationDto {
  @ApiProperty({ description: "Email address of the user to invite" })
  @IsEmail()
  email: string

  @ApiProperty({ description: "Role to assign to the invited user", example: "member" })
  @IsString()
  @IsNotEmpty()
  role: string
}
