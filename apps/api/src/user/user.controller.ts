import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger"

import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { SessionGuard } from "../auth/guards/session.guard"

@ApiTags("users")
@Controller("users")
export class UserController {
  @Get("me")
  @UseGuards(SessionGuard)
  @ApiCookieAuth("session")
  @ApiOperation({ summary: "Get current authenticated user profile" })
  getMe(@CurrentUser() user: Record<string, unknown>) {
    return {
      id: user["id"],
      name: user["name"],
      email: user["email"],
      image: user["image"] ?? null,
      emailVerified: user["emailVerified"],
    }
  }
}
