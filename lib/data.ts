import {
  getTrendingPosts,
  getSentimentBreakdown,
  getDDQualityDistribution,
} from "@/lib/db/clickhouse";
import {
  mockTrendingPosts,
  mockSentiment,
  mockDDQuality,
  mockMarketIndices,
  mockWatchlist,
} from "@/lib/mock-data";
import { getMarketIndices, getQuotes } from "@/lib/stocks/prices";
import type {
  ProcessedPost,
  SentimentBreakdown,
  MarketIndex,
  WatchlistItem,
} from "@/lib/types";

const USE_DB = Boolean(process.env.CLICKHOUSE_URL);

export async function getDashboardTrendingPosts(): Promise<ProcessedPost[]> {
  if (!USE_DB) return mockTrendingPosts;
  try {
    const posts = await getTrendingPosts(3.5, 10);
    return posts.length > 0 ? posts : mockTrendingPosts;
  } catch {
    return mockTrendingPosts;
  }
}

export async function getDashboardSentiment(): Promise<SentimentBreakdown> {
  if (!USE_DB) return mockSentiment;
  try {
    return await getSentimentBreakdown();
  } catch {
    return mockSentiment;
  }
}

export async function getDashboardDDQuality(): Promise<
  { rating: number; count: number }[]
> {
  if (!USE_DB) return mockDDQuality;
  try {
    const data = await getDDQualityDistribution();
    return data.length > 0 ? data : mockDDQuality;
  } catch {
    return mockDDQuality;
  }
}

export async function getDashboardMarketIndices(): Promise<MarketIndex[]> {
  try {
    const indices = await getMarketIndices();
    return indices.length > 0 ? indices : mockMarketIndices;
  } catch {
    return mockMarketIndices;
  }
}

const WATCHLIST_TICKERS = ["ASTS", "PLTR", "NVDA", "TSLA", "SOFI"];

export async function getDashboardWatchlist(): Promise<WatchlistItem[]> {
  try {
    const quotes = await getQuotes(WATCHLIST_TICKERS);
    if (quotes.length === 0) return mockWatchlist;
    return quotes.map((q) => {
      const mock = mockWatchlist.find((w) => w.ticker === q.ticker);
      return {
        ticker: q.ticker,
        price: q.price,
        changePercent: q.changePercent,
        ddCount: mock?.ddCount ?? 0,
        sentiment: mock?.sentiment ?? "neutral",
      };
    });
  } catch {
    return mockWatchlist;
  }
}
