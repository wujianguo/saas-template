# AGENTS.md

本仓库目标是一个 agent 友好的 SaaS 模版 monorepo，包含后端、Web、App、文档、CLI、skills。

## 1. 目录规划

```txt
apps/
  backend/   # NestJS + better-auth + Prisma + Swagger
  web/       # Next.js + shadcn/ui
  app/       # Expo
  docs/      # Fumadocs
packages/
  cli/       # 对后端 API 的命令行封装
  skills/    # 可通过 npx 安装，供 agent 调用 CLI
```

## 2. 后端能力要求（apps/backend）

- 技术栈：NestJS + better-auth + Prisma + Swagger + class-validator + class-transformer。
- 使用 better-auth 管理：
  - authentication
  - organization
  - project
  - team
- 需要对外提供独立 REST API：
  - 调用方可感知 better-auth，也可不感知（通过业务语义接口访问）。
- 需要支持 API Key 方式调用：
  - API Key 的签发、查询、禁用、轮转等管理能力。
  - 复用 better-auth 的 API Key 能力。
- 所有后端接口都必须提供 MCP 调用方式（与 REST 对齐）。

## 3. Web / App / Docs / CLI / Skills 要求

- `apps/web`（Next.js + shadcn/ui）：
  - 提供管理台能力（账号、组织、项目、团队、API Key）。
- `apps/app`（Expo）：
  - 提供移动端基础功能与鉴权接入。
- `apps/docs`（Fumadocs）：
  - 提供 REST + MCP + CLI + Skills 使用文档。
- `packages/cli`：
  - 封装后端公开接口（含 API Key 场景）。
  - 命令语义与后端 REST/MCP 保持一致。
- `packages/skills`：
  - 预置 agent 可直接调用的 skills。
  - 通过 `npx` 安装，内部通过 CLI 调后端接口。

## 4. Agent 友好约束（全项目）

- 所有模块需保证：
  - 清晰的输入/输出契约（类型、schema、错误码）。
  - 完整的机器可读文档（OpenAPI / MCP tool schema / CLI help）。
  - 稳定命令与参数，不随意破坏兼容。
- 变更时需同步更新：
  - REST 文档
  - MCP 工具定义
  - CLI 命令帮助
  - docs 示例

## 5. 交付原则

- 保持 monorepo 一致性与低耦合分层。
- 先定义契约（REST + MCP + CLI），再实现功能。
- 所有新增能力默认需要考虑 agent 调用路径。
