# WallStreetBets.top

AI-powered investment intelligence platform that analyzes r/wallstreetbets posts for sentiment, stock mentions, and DD quality.

**Live:** [wallstreetbets.top](https://wallstreetbets.top)

## How it works

```
Reddit API ──> LLM Analysis ──> ClickHouse + Weaviate ──> Dashboard
  (hot posts)    (sentiment,       (structured data,       (Next.js)
                  tickers,          vector search)
                  summary,
                  DD quality)
```

Every 15 minutes, a pipeline:
1. Fetches hot posts from r/wallstreetbets via Reddit OAuth2 API
2. Analyzes each post with an LLM (Claude, GPT, or any OpenAI-compatible API) to extract sentiment, stock tickers, summary, and DD quality score
3. Stores structured data in ClickHouse and vector embeddings in Weaviate
4. The dashboard reads from these databases and shows real stock prices from Yahoo Finance

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), shadcn/ui, Tailwind, Recharts |
| LLM | Anthropic Claude, OpenAI, or any OpenAI-compatible API |
| Data | Reddit OAuth2 API, Yahoo Finance |
| Storage | ClickHouse (OLAP), Weaviate (vector search) |
| Deploy | Vercel (cron-triggered pipeline) |
| Dev env | Nix flakes + direnv + pnpm |

## Getting started

### Prerequisites

- Node.js 22+ and pnpm (provided by nix flake if you use `direnv allow`)
- ClickHouse instance ([ClickHouse Cloud](https://clickhouse.cloud) free tier works)
- Reddit API credentials ([create an app](https://www.reddit.com/prefs/apps))
- LLM API key (Anthropic or OpenAI)
- Optional: Weaviate instance for semantic search

### Setup

```bash
# Clone
git clone https://github.com/sunapi386/wallstreetbets.git
cd wallstreetbets

# If using nix + direnv (recommended):
direnv allow

# Otherwise:
pnpm install

# Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize database schema
npx tsx --env-file=.env.local scripts/seed.ts

# Run
pnpm dev
```

### LLM configuration

The analyzer supports multiple LLM providers. Set one of these in `.env.local`:

```bash
# Option 1: Anthropic Claude (default if ANTHROPIC_API_KEY is set)
ANTHROPIC_API_KEY=sk-ant-...

# Option 2: OpenAI
OPENAI_API_KEY=sk-...

# Option 3: Any OpenAI-compatible API (OpenRouter, Together, local Ollama, etc.)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=meta-llama/llama-3-70b-instruct

# Override defaults
LLM_PROVIDER=openai    # Force provider (anthropic | openai)
LLM_MODEL=gpt-4o       # Override model
```

### Trigger the pipeline

```bash
# Manually
curl -X POST http://localhost:3000/api/pipeline

# With auth (production)
curl -X POST -H "Authorization: Bearer $PIPELINE_SECRET" https://wallstreetbets.top/api/pipeline
```

On Vercel, the pipeline runs automatically every 15 minutes via cron.

## Project structure

```
app/
  page.tsx                # Dashboard (server component, ISR 60s)
  screener/page.tsx       # Stock screener with mention counts
  search/page.tsx         # Semantic search over DDs
  api/
    pipeline/route.ts     # Cron endpoint: fetch -> analyze -> store
    posts/route.ts        # GET processed posts
    sentiment/route.ts    # GET sentiment breakdown
    stocks/route.ts       # GET stock prices (Yahoo Finance proxy)
    search/route.ts       # GET semantic search (Weaviate)
components/
  app-sidebar.tsx         # Navigation sidebar
  market-overview.tsx     # S&P 500 / NASDAQ cards
  watchlist-card.tsx      # Watchlist with DD badges
  sentiment-chart.tsx     # Bullish/Neutral/Bearish pie chart
  dd-quality-chart.tsx    # DD quality distribution
  trending-dds.tsx        # Trending high-quality DDs
lib/
  db/clickhouse.ts        # ClickHouse client + typed queries
  db/weaviate.ts          # Weaviate client + semantic search
  reddit/fetcher.ts       # Reddit OAuth2 API client
  stocks/prices.ts        # Yahoo Finance wrapper
  llm/analyzer.ts         # Multi-provider LLM analyzer
  pipeline/processor.ts   # Pipeline orchestrator
  types.ts                # Shared TypeScript types
  data.ts                 # Data layer (DB with mock fallback)
```

## AceTeam Workflow

The data pipeline (fetch Reddit -> LLM analysis -> store) can also be expressed as an [AceTeam](https://aceteam.ai) workflow:

```
[Input: subreddit, limit]
    |
[APICall: Reddit OAuth2] --> raw posts
    |
[LLM: analyze sentiment/tickers/quality] --> structured analysis
    |
[APICall: POST to /api/pipeline/ingest] --> stored in ClickHouse + Weaviate
    |
[Output: processed count, errors]
```

This enables running the analysis pipeline via `ace run` on any compute, scheduling it via AceTeam's workflow engine, and swapping LLM providers per-run.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsunapi386%2Fwallstreetbets)

Set all env vars from `.env.example` in the Vercel dashboard. The cron job (`vercel.json`) will auto-activate on deploy.
