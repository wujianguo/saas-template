# AGENTS.md — web

## Commands

```bash
pnpm --filter web dev                  # start dev server
pnpm --filter web lint                 # lint
```

## Architecture

Next.js 16 with App Router, Tailwind CSS 4, and shadcn/ui (new-york style, CSS variables). Form handling uses react-hook-form with zod validation. The `@/lib/utils` re-exports `cn()` (clsx + tailwind-merge).
