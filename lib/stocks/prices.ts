import YahooFinance from "yahoo-finance2";
import type { MarketIndex, StockQuote } from "@/lib/types";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const quoteCache = new Map<string, { data: StockQuote; expiry: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

async function fetchQuote(ticker: string): Promise<StockQuote | null> {
  const cached = quoteCache.get(ticker);
  if (cached && cached.expiry > Date.now()) return cached.data;

  try {
    const result = await yahooFinance.quote(ticker);
    const quote: StockQuote = {
      ticker,
      price: result.regularMarketPrice ?? 0,
      change: result.regularMarketChange ?? 0,
      changePercent: result.regularMarketChangePercent ?? 0,
    };
    quoteCache.set(ticker, { data: quote, expiry: Date.now() + CACHE_TTL_MS });
    return quote;
  } catch (error) {
    console.error(`Failed to fetch quote for ${ticker}:`, error);
    return null;
  }
}

export async function getQuote(ticker: string): Promise<StockQuote | null> {
  return fetchQuote(ticker);
}

export async function getQuotes(tickers: string[]): Promise<StockQuote[]> {
  const results = await Promise.allSettled(tickers.map(fetchQuote));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<StockQuote | null> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value)
    .filter((q): q is StockQuote => q !== null);
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^IXIC", name: "NASDAQ" },
  ];

  const results = await Promise.allSettled(
    symbols.map(async ({ symbol, name }) => {
      const result = await yahooFinance.quote(symbol);
      return {
        name,
        value: result.regularMarketPrice ?? 0,
        change: result.regularMarketChange ?? 0,
        changePercent: result.regularMarketChangePercent ?? 0,
      } satisfies MarketIndex;
    }),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<MarketIndex> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value);
}
