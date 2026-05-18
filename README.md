# SaaS Template Monorepo

基于 **pnpm workspace + Turborepo** 的 SaaS 模板仓库，包含前端（Next.js）和后端（NestJS）应用，以及共享包配置。

## 项目结构

```text
apps/
  web/                # Next.js 16 前端应用
  api/                # NestJS 11 后端应用
packages/
  ui/                 # 共享 UI 组件库
  api/                # 前后端共享 API 常量/类型
  eslint-config/      # 共享 ESLint 配置
  typescript-config/  # 共享 TypeScript 配置
  jest-config/        # 共享 Jest 配置
```

## 环境要求

- Node.js >= 20
- pnpm 9（推荐通过 corepack 使用）

## 快速开始

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
pnpm dev
```

默认情况下：

- `apps/web` 启动 Next.js 开发服务
- `apps/api` 启动 NestJS 开发服务（默认端口 `3001`，可通过 `PORT` 环境变量覆盖）

## 常用命令（仓库根目录）

```bash
pnpm lint        # 运行所有 workspace 的 lint
pnpm test        # 运行测试（当前主要是 api 单测）
pnpm test:e2e    # 运行 e2e 测试
pnpm typecheck   # 类型检查
pnpm build       # 构建所有可构建 workspace
```

## 组件开发（shadcn/ui）

在仓库根目录执行：

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

组件会生成到 `packages/ui/src/components`，在应用中通过 `@workspace/ui` 引用。
