# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

This is a SaaS starter template using **pnpm workspaces (v9.15.9) + Turborepo (v2)**. Node.js >= 20 required.

```
apps/
  web/   # Next.js 16 (App Router) + Tailwind v4 + shadcn/ui
  api/   # NestJS 11 (Express) — no database yet
packages/
  ui/                # Shared shadcn/ui components, Tailwind config, global CSS
  api/               # Shared API types/constants (e.g., HelloResponse, HELLO_MESSAGE)
  eslint-config/     # Flat ESLint configs (base, next-js, react-internal, node, nest-js)
  typescript-config/ # TS configs (base, nextjs, nestjs, react-library)
  jest-config/       # Jest configs (base, nest)
```

## Commands (run from repo root)

```bash
pnpm dev          # Start all apps (Turbopack for web, --watch for api)
pnpm build        # Build all
pnpm lint         # Lint all
pnpm format       # Prettier all
pnpm typecheck    # TypeScript check all
pnpm test         # Unit tests (api)
pnpm test:e2e     # E2e tests (api)
```

Tests live only in `apps/api`. Run a single test file:
```bash
cd apps/api && pnpm test -- --testPathPattern="app.controller"
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components land in `packages/ui/src/components/` and are importable as `@workspace/ui/components/<name>` in both apps.

## Key Architecture Details

### Shared UI package (`@workspace/ui`)

- **All Tailwind/config lives here.** The global CSS (`src/styles/globals.css`) uses Tailwind v4 `@import` syntax (not `@tailwind base`). Dark mode via `.dark` class (`@custom-variant dark`).
- `apps/web/postcss.config.mjs` delegates entirely to `@workspace/ui/postcss.config`.
- `apps/web/next.config.mjs` has `transpilePackages: ["@workspace/ui"]` so Next.js compiles the workspace package.
- Exports map: `./globals.css`, `./postcss.config`, `./lib/*`, `./components/*`, `./hooks/*` — no top-level `"."` export.

### Frontend (`apps/web`)

- Next.js 16 App Router. Routes live in `app/`. No `src/` or `pages/` directory.
- Dev uses `--turbopack`. Production build uses `next build`.
- Path aliases: `@/*` → `apps/web/*`, `@workspace/ui/*` → `packages/ui/src/*` (for IDE; runtime resolves via package.json exports).
- The single local component `components/theme-provider.tsx` wraps `next-themes` and listens for the `d` key to toggle dark/light mode.

### Backend (`apps/api`)

- NestJS 11 on Express. Default port `3001` (override with `PORT` env var, declared in `turbo.json` globalEnv).
- `main.ts` enables CORS with no origin restrictions. No global prefix, validation pipes, or exception filters yet.
- Two tsconfigs: `tsconfig.json` (for IDE/typecheck) and `tsconfig.build.json` (excludes tests for build).
- Jest moduleNameMapper resolves `@workspace/api` directly to source (packages/api/src/) so tests don't depend on a pre-built dist.

### Shared API types (`@workspace/api`)

- Exports types and constants used by both frontend and backend. Currently just `HelloResponse` and `HELLO_MESSAGE`.
- `main` field points to `dist/` (compiled JS), `types` field points to `src/` (source TS).

### ESLint

- Root `.eslintrc.js` only sets `root: true` and ignores build output directories.
- All workspaces use flat ESLint configs (`eslint.config.js`/`eslint.config.mjs`) that re-export from `@workspace/eslint-config`.
- The `turbo/no-undeclared-env-vars` rule is enabled as a warning — if you add a new env var, declare it in `turbo.json` `globalEnv`.

### TypeScript

- Root `tsconfig.json` extends `@workspace/typescript-config/base.json` (strict mode, ES2022, NodeNext module resolution).
- NestJS config relaxes strictness (`strictNullChecks: false`, `noImplicitAny: false`) and enables `experimentalDecorators` + `emitDecoratorMetadata`.
- Next.js config uses `module: "ESNext"`, `moduleResolution: "Bundler"`, `jsx: "preserve"`, `noEmit: true`.

### Prettier

- Settings: `semi: false`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: "es5"`, `printWidth: 80`.
- Uses `prettier-plugin-tailwindcss` wired to the shared globals.css, with `tailwindFunctions: ["cn", "cva"]`.

-----

## Rule 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Rule 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Rule 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## Rule 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.



## Rule 5 — Use the model only for judgment calls
Use Claude for: classification, drafting, summarization, extraction from unstructured text.
Do NOT use Claude for: routing, retries, status-code handling, deterministic transforms.
If a status code already answers the question, plain code answers the question.


## Rule 6 — Token budgets are not advisory
Per-task budget: 4,000 tokens.
Per-session budget: 30,000 tokens.
If a task is approaching budget, summarize and start fresh. Do not push through.
Surfacing the breach > silently overrunning.


## Rule 7 — Surface conflicts, don't average them
If two existing patterns in the codebase contradict, don't blend them.
Pick one (the more recent / more tested), explain why, and flag the other for cleanup.
"Average" code that satisfies both rules is the worst code.


## Rule 8 — Read before you write
Before adding code in a file, read the file's exports, the immediate caller, and any obvious shared utilities.
If you don't understand why existing code is structured the way it is, ask before adding to it.
"Looks orthogonal to me" is the most dangerous phrase in this codebase.


## Rule 9 — Tests verify intent, not just behavior
Every test must encode WHY the behavior matters, not just WHAT it does.
A test like `expect(getUserName()).toBe('John')` is worthless if the function takes a hardcoded ID.
If you can't write a test that would fail when business logic changes, the function is wrong.


## Rule 10 — Checkpoint after every significant step
After completing each step in a multi-step task: summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back to me.
If you lose track, stop and restate.


## Rule 11 — Match the codebase's conventions, even if you disagree
If the codebase uses snake_case and you'd prefer camelCase: snake_case.
If the codebase uses class-based components and you'd prefer hooks: class-based.
Disagreement is a separate conversation. Inside the codebase, conformance > taste.
If you genuinely think the convention is harmful, surface it. Don't fork it silently.


## Rule 12 — Fail loud
If you can't be sure something worked, say so explicitly.
"Migration completed" is wrong if 30 records were skipped silently.
"Tests pass" is wrong if you skipped any.
"Feature works" is wrong if you didn't verify the edge case I asked about.
Default to surfacing uncertainty, not hiding it.
