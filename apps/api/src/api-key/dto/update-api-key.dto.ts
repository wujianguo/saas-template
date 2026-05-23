import { ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"

export class UpdateApiKeyDto {
  @ApiPropertyOptional({ description: "Key name" })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: "Whether the key is enabled" })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiPropertyOptional({ description: "Key metadata" })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @ApiPropertyOptional({ description: "Key permissions" })
  @IsObject()
  @IsOptional()
  permissions?: Record<string, string[]>

  @ApiPropertyOptional({ description: "Whether rate limiting is enabled" })
  @IsBoolean()
  @IsOptional()
  rateLimitEnabled?: boolean

  @ApiPropertyOptional({ description: "Maximum requests per window" })
  @IsNumber()
  @IsOptional()
  rateLimitMax?: number

  @ApiPropertyOptional({ description: "Rate limit time window (ms)" })
  @IsNumber()
  @IsOptional()
  rateLimitTimeWindow?: number
}
