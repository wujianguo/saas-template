# SaaS Template Monorepo

A SaaS starter template built on **pnpm workspaces + Turborepo**, featuring a Next.js frontend, a NestJS backend, and a set of shared packages.

## Project Structure

```text
apps/
  web/                # Next.js 16 frontend app
  api/                # NestJS 11 backend app
packages/
  ui/                 # Shared UI component library
  api/                # Shared API constants / types
  eslint-config/      # Shared ESLint configuration
  typescript-config/  # Shared TypeScript configuration
  jest-config/        # Shared Jest configuration
```

## Requirements

- Node.js >= 20
- pnpm 9 (recommended via corepack)

## Getting Started

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
pnpm dev
```

By default:

- `apps/web` starts the Next.js development server
- `apps/api` starts the NestJS development server (default port `3001`, override with the `PORT` environment variable)

## Common Commands (repo root)

```bash
pnpm lint        # Lint all workspaces
pnpm test        # Run unit tests (primarily the api app)
pnpm test:e2e    # Run e2e tests
pnpm typecheck   # Type-check all workspaces
pnpm build       # Build all buildable workspaces
```

## Adding UI Components (shadcn/ui)

Run from the repo root:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are generated into `packages/ui/src/components` and can be imported via `@workspace/ui` in any app.
