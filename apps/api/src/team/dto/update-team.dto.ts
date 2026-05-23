import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateTeamDto {
  @ApiPropertyOptional({ description: "Team name" })
  @IsString()
  @IsOptional()
  name?: string
}
