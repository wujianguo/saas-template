import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ApiKeyModule } from "./api-key/api-key.module"
import { AuthModule } from "./auth/auth.module"
import { OrganizationModule } from "./organization/organization.module"
import { PrismaModule } from "./prisma/prisma.module"
import { ProjectModule } from "./project/project.module"
import { TeamModule } from "./team/team.module"
import { UserModule } from "./user/user.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    TeamModule,
    ProjectModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
