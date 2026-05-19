import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddMemberDto {
  @ApiPropertyOptional({ description: "User ID to add as member" })
  @IsString()
  @IsOptional()
  userId?: string

  @ApiPropertyOptional({ description: "Email of user to add as member" })
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty({ description: "Role to assign to the member", example: "member" })
  @IsString()
  @IsNotEmpty()
  role: string
}
