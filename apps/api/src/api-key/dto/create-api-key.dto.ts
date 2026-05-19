import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateApiKeyDto {
  @ApiProperty({ description: "Key name" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: "Key scope", enum: ["user", "organization"] })
  @IsIn(["user", "organization"])
  configId: "user" | "organization"

  @ApiPropertyOptional({
    description: "Organization ID (required when configId is organization)",
  })
  @IsString()
  @IsOptional()
  organizationId?: string

  @ApiPropertyOptional({ description: "Expiry date (ISO 8601)" })
  @IsDateString()
  @IsOptional()
  expiresAt?: string

  @ApiPropertyOptional({ description: "Key permissions" })
  @IsObject()
  @IsOptional()
  permissions?: Record<string, string[]>

  @ApiPropertyOptional({ description: "Key metadata" })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
