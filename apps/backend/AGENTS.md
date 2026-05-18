# AGENTS.md — backend

## Commands

```bash
pnpm --filter backend test             # unit tests (*.spec.ts)
pnpm --filter backend test:e2e         # e2e tests (*.e2e-spec.ts)
pnpm --filter backend test:cov         # test coverage
pnpm --filter backend start:dev        # start dev server

# Single-file test
cd apps/backend && pnpm test -- --testPathPattern="app.controller"
```

## Architecture

NestJS 11 with `nodenext` module resolution and strict TypeScript (`strictNullChecks`, `noImplicitAny`, `strictBindCallApply`).

**Bootstrap (main.ts):**
1. **Global ValidationPipe** — `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`. All DTOs use `class-validator` + `class-transformer` decorators.
2. **CORS** — origin from `CORS_ORIGIN` env var.
3. **Swagger** — available at `/api` with Bearer auth.

**Module graph:**
- `AppModule` → imports `PrismaModule` (global), `AuthModule`
- `PrismaModule` — marked `@Global()`, provides `PrismaService` (singleton PrismaClient that connects on module init)
- `AuthModule` — contains `AuthController` only, no separate service
- `AuthController` — catch-all `@All('*')` route at `/auth` that proxies all requests to the `better-auth` handler

**better-auth integration:** The better-auth instance is created in `src/auth/better-auth.ts` with its own `PrismaClient` (separate from the NestJS-managed `PrismaService`). It uses the prismaAdapter with PostgreSQL and enables `emailAndPassword`. All auth routes go through Express request/response passthrough in `AuthController`.

**Prisma schema:** Models for `User`, `Session`, `Account`, `Verification` — follows better-auth's expected schema with `@@map()` to snake_case table names.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend port (default 3001) |
| `CORS_ORIGIN` | Allowed CORS origin (default `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | better-auth signing secret |
| `BETTER_AUTH_URL` | better-auth base URL (default `http://localhost:3001`) |
