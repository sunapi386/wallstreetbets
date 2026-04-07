export interface ProcessedPost {
  id: string;
  subreddit: string;
  title: string;
  content: string;
  author: string;
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  tickers: string[];
  ddQualityScore: number;
  flair: string;
  upvotes: number;
  numComments: number;
  upvoteRatio: number;
  createdUtc: Date;
  url: string;
}

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface SentimentBreakdown {
  bullish: number;
  neutral: number;
  bearish: number;
}

export interface WatchlistItem {
  ticker: string;
  price: number;
  changePercent: number;
  ddCount: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}
