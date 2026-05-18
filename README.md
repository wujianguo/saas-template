# saas-template

SaaS 模版 Monorepo（规划骨架）：

- `apps/backend`: NestJS + better-auth + Prisma + Swagger + class-validator + class-transformer
- `apps/web`: Next.js + shadcn/ui
- `apps/app`: Expo
- `apps/docs`: Fumadocs
- `packages/cli`: 封装后端接口
- `packages/skills`: 供 agent 通过 `npx` 安装并结合 CLI 调用后端接口

详细的 agent 协作与落地约束见根目录 `AGENTS.md`。
