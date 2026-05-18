# AGENTS.md — docs

## Commands

```bash
pnpm --filter docs dev                 # start dev server
```

## Architecture

fumadocs with MDX content in `content/docs/`. The `source.config.ts` defines the docs collection. `lib/source.ts` exports a `loader()`-based source with lucide icons plugin. The `proxy.ts` middleware handles markdown content negotiation — rewriting docs routes to raw `.md` content when the client prefers markdown. LLM-friendly routes at `/llms.txt` and `/llms-full.txt` serve documentation text for AI consumption.
