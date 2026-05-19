import { Global, Module } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { ApiKeyGuard } from "./guards/api-key.guard"
import { SessionGuard } from "./guards/session.guard"

@Global()
@Module({
  providers: [AuthService, SessionGuard, ApiKeyGuard],
  exports: [AuthService, SessionGuard, ApiKeyGuard],
})
export class AuthModule {}
