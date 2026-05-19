import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: "Organization name" })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: "Organization logo URL" })
  @IsString()
  @IsOptional()
  logo?: string

  @ApiPropertyOptional({ description: "Organization metadata (JSON string)" })
  @IsString()
  @IsOptional()
  metadata?: string
}
