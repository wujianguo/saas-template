# saas-template

A full-stack SaaS monorepo using pnpm workspaces and Turborepo.

## Apps

| App | Stack | Port |
|-----|-------|------|
| `apps/backend` | NestJS + better-auth + Prisma + Swagger + class-validator | 3001 |
| `apps/web` | Next.js + shadcn/ui | 3000 |
| `apps/docs` | fumadocs | 3002 |

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env files and configure
cp apps/backend/.env.example apps/backend/.env

# Run all apps in dev mode
pnpm dev

# Build all apps
pnpm build
```

## Structure

```
saas-template/
├── apps/
│   ├── backend/      # NestJS API
│   ├── web/          # Next.js frontend
│   └── docs/         # fumadocs documentation
├── packages/         # Shared packages (future)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Backend

- **Framework**: NestJS (strict mode)
- **Auth**: better-auth with email/password
- **ORM**: Prisma (PostgreSQL)
- **API Docs**: Swagger at `/api`
- **Validation**: class-validator + class-transformer

## Web

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: react-hook-form + zod

## Docs

- **Framework**: fumadocs (Next.js-based documentation)