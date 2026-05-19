import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateOrganizationDto {
  @ApiProperty({ description: "Organization name" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({ description: "Organization slug (URL-safe identifier)" })
  @IsString()
  @IsOptional()
  slug?: string
}
