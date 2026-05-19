import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, Matches } from "class-validator"

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: "Project name" })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    description: "URL-safe slug (lowercase alphanumeric and hyphens)",
    example: "my-project",
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: "slug must only contain lowercase letters, numbers, and hyphens",
  })
  slug?: string

  @ApiPropertyOptional({ description: "Project description" })
  @IsString()
  @IsOptional()
  description?: string
}
