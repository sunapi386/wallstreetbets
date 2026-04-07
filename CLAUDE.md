@AGENTS.md

# WallStreetBets.top

AI-powered investment intelligence platform analyzing r/wallstreetbets posts.

## Architecture

Next.js 16 monolith (App Router) with:
- **Frontend**: shadcn/ui + Tailwind CSS + Recharts
- **Data Pipeline**: Reddit API -> Claude API (sentiment/summary/tickers) -> ClickHouse + Weaviate
- **Stock Prices**: Yahoo Finance via yahoo-finance2
- **Deployment**: Vercel with cron-triggered pipeline

## Development

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server (port 3000)
pnpm build      # Production build
pnpm lint       # ESLint
```

## Directory Structure

```
app/              # Next.js App Router pages and API routes
components/       # React components
  ui/             # shadcn/ui primitives
lib/              # Shared utilities
  db/             # ClickHouse + Weaviate clients
  reddit/         # Reddit API fetcher
  stocks/         # Stock price fetcher
  llm/            # Claude API analyzer
  pipeline/       # Data pipeline orchestrator
  types.ts        # Shared TypeScript types
  mock-data.ts    # Mock data for development
```

## Key Patterns

- Server Components for data-heavy pages (query DB directly)
- Client Components only for interactive widgets (charts, sidebar)
- API routes for mutations and external API proxies
- `render` prop (not `asChild`) for shadcn sidebar polymorphism (base-ui v1)
