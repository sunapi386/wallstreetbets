import { createClient } from "@clickhouse/client";
import type { ProcessedPost, SentimentBreakdown } from "@/lib/types";

function getClient() {
  return createClient({
    url: process.env.CLICKHOUSE_URL,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DATABASE,
  });
}

let clientInstance: ReturnType<typeof getClient> | null = null;

export function getClickHouseClient() {
  if (!clientInstance) {
    clientInstance = getClient();
  }
  return clientInstance;
}

export const INIT_SQL = `
CREATE TABLE IF NOT EXISTS reddit_posts (
  id String,
  subreddit String,
  title String,
  content String,
  author String,
  summary String,
  sentiment String,
  sentiment_score Float32,
  tickers Array(String),
  dd_quality_score Float32,
  flair String,
  upvotes UInt32,
  num_comments UInt32,
  upvote_ratio Float32,
  created_utc DateTime,
  fetched_at DateTime DEFAULT now(),
  processed_at DateTime DEFAULT now(),
  url String
) ENGINE = ReplacingMergeTree(fetched_at)
ORDER BY (id);

CREATE TABLE IF NOT EXISTS stock_mentions (
  ticker String,
  post_id String,
  sentiment String,
  sentiment_score Float32,
  created_utc DateTime,
  fetched_at DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (ticker, created_utc);

CREATE TABLE IF NOT EXISTS stock_prices (
  ticker String,
  price Float64,
  change_percent Float32,
  fetched_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(fetched_at)
ORDER BY (ticker, fetched_at);
`;

export async function initSchema() {
  const client = getClickHouseClient();
  const statements = INIT_SQL.split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) {
    await client.command({ query: sql });
  }
}

export async function insertPost(post: ProcessedPost) {
  const client = getClickHouseClient();
  await client.insert({
    table: "reddit_posts",
    values: [
      {
        id: post.id,
        subreddit: post.subreddit,
        title: post.title,
        content: post.content,
        author: post.author,
        summary: post.summary,
        sentiment: post.sentiment,
        sentiment_score: post.sentimentScore,
        tickers: post.tickers,
        dd_quality_score: post.ddQualityScore,
        flair: post.flair,
        upvotes: post.upvotes,
        num_comments: post.numComments,
        upvote_ratio: post.upvoteRatio,
        created_utc: Math.floor(post.createdUtc.getTime() / 1000),
        url: post.url,
      },
    ],
    format: "JSONEachRow",
  });

  // Also insert into stock_mentions for aggregation
  for (const ticker of post.tickers) {
    await client.insert({
      table: "stock_mentions",
      values: [
        {
          ticker,
          post_id: post.id,
          sentiment: post.sentiment,
          sentiment_score: post.sentimentScore,
          created_utc: Math.floor(post.createdUtc.getTime() / 1000),
        },
      ],
      format: "JSONEachRow",
    });
  }
}

export async function insertPosts(posts: ProcessedPost[]) {
  for (const post of posts) {
    await insertPost(post);
  }
}

export async function getRecentPosts(limit = 20): Promise<ProcessedPost[]> {
  const client = getClickHouseClient();
  const result = await client.query({
    query: `SELECT * FROM reddit_posts ORDER BY created_utc DESC LIMIT {limit:UInt32}`,
    query_params: { limit },
    format: "JSONEachRow",
  });
  const rows = await result.json<Record<string, unknown>>();
  return rows.map(rowToPost);
}

export async function getTrendingPosts(
  minQuality = 3.5,
  limit = 10,
): Promise<ProcessedPost[]> {
  const client = getClickHouseClient();
  const result = await client.query({
    query: `
      SELECT * FROM reddit_posts
      WHERE dd_quality_score >= {minQuality:Float32}
      ORDER BY created_utc DESC
      LIMIT {limit:UInt32}
    `,
    query_params: { minQuality, limit },
    format: "JSONEachRow",
  });
  const rows = await result.json<Record<string, unknown>>();
  return rows.map(rowToPost);
}

export async function getSentimentBreakdown(): Promise<SentimentBreakdown> {
  const client = getClickHouseClient();
  const result = await client.query({
    query: `
      SELECT
        sentiment,
        count() as cnt
      FROM reddit_posts
      WHERE created_utc > now() - INTERVAL 7 DAY
      GROUP BY sentiment
    `,
    format: "JSONEachRow",
  });
  const rows = await result.json<{ sentiment: string; cnt: string }>();
  const breakdown: SentimentBreakdown = { bullish: 0, neutral: 0, bearish: 0 };
  let total = 0;
  for (const row of rows) {
    const count = parseInt(row.cnt, 10);
    total += count;
    if (row.sentiment in breakdown) {
      breakdown[row.sentiment as keyof SentimentBreakdown] = count;
    }
  }
  // Convert to percentages
  if (total > 0) {
    breakdown.bullish = Math.round((breakdown.bullish / total) * 100);
    breakdown.bearish = Math.round((breakdown.bearish / total) * 100);
    breakdown.neutral = 100 - breakdown.bullish - breakdown.bearish;
  }
  return breakdown;
}

export async function getDDQualityDistribution(): Promise<
  { rating: number; count: number }[]
> {
  const client = getClickHouseClient();
  const result = await client.query({
    query: `
      SELECT
        floor(dd_quality_score) as rating,
        count() as cnt
      FROM reddit_posts
      WHERE dd_quality_score > 0
      GROUP BY rating
      ORDER BY rating
    `,
    format: "JSONEachRow",
  });
  const rows = await result.json<{ rating: number; cnt: string }>();
  return rows.map((r) => ({ rating: Number(r.rating), count: parseInt(r.cnt, 10) }));
}

export async function getTopMentionedTickers(
  limit = 10,
): Promise<{ ticker: string; mentions: number; avgSentiment: number }[]> {
  const client = getClickHouseClient();
  const result = await client.query({
    query: `
      SELECT
        ticker,
        count() as mentions,
        avg(sentiment_score) as avg_sentiment
      FROM stock_mentions
      WHERE created_utc > now() - INTERVAL 7 DAY
      GROUP BY ticker
      ORDER BY mentions DESC
      LIMIT {limit:UInt32}
    `,
    query_params: { limit },
    format: "JSONEachRow",
  });
  const rows = await result.json<
    { ticker: string; mentions: string; avg_sentiment: number }
  >();
  return rows.map((r) => ({
    ticker: r.ticker,
    mentions: parseInt(r.mentions, 10),
    avgSentiment: r.avg_sentiment,
  }));
}

export async function getExistingPostIds(ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const client = getClickHouseClient();
  const result = await client.query({
    query: `SELECT id FROM reddit_posts WHERE id IN ({ids:Array(String)})`,
    query_params: { ids },
    format: "JSONEachRow",
  });
  const rows = await result.json<{ id: string }>();
  return new Set(rows.map((r) => r.id));
}

function rowToPost(row: Record<string, unknown>): ProcessedPost {
  return {
    id: row.id as string,
    subreddit: row.subreddit as string,
    title: row.title as string,
    content: row.content as string,
    author: row.author as string,
    summary: row.summary as string,
    sentiment: row.sentiment as ProcessedPost["sentiment"],
    sentimentScore: Number(row.sentiment_score),
    tickers: row.tickers as string[],
    ddQualityScore: Number(row.dd_quality_score),
    flair: row.flair as string,
    upvotes: Number(row.upvotes),
    numComments: Number(row.num_comments),
    upvoteRatio: Number(row.upvote_ratio),
    createdUtc: new Date((row.created_utc as string) + "Z"),
    url: row.url as string,
  };
}
