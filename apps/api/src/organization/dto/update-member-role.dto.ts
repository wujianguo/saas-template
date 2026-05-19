import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateMemberRoleDto {
  @ApiProperty({ description: "New role for the member", example: "admin" })
  @IsString()
  @IsNotEmpty()
  role: string
}
