import type {
  ProcessedPost,
  WatchlistItem,
  MarketIndex,
  SentimentBreakdown,
} from "./types";

export const mockMarketIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5248.49, change: 41.63, changePercent: 0.8 },
  { name: "NASDAQ", value: 16428.82, change: 197.15, changePercent: 1.2 },
];

export const mockWatchlist: WatchlistItem[] = [
  {
    ticker: "ASTS",
    price: 28.45,
    changePercent: 5.2,
    ddCount: 12,
    sentiment: "bullish",
  },
  {
    ticker: "PLTR",
    price: 72.31,
    changePercent: -1.3,
    ddCount: 8,
    sentiment: "bullish",
  },
  {
    ticker: "NVDA",
    price: 875.28,
    changePercent: 2.1,
    ddCount: 15,
    sentiment: "bullish",
  },
  {
    ticker: "TSLA",
    price: 245.62,
    changePercent: -0.7,
    ddCount: 6,
    sentiment: "neutral",
  },
  {
    ticker: "SOFI",
    price: 9.87,
    changePercent: 3.4,
    ddCount: 4,
    sentiment: "bullish",
  },
];

export const mockSentiment: SentimentBreakdown = {
  bullish: 45,
  neutral: 35,
  bearish: 20,
};

export const mockDDQuality = [
  { rating: 1, count: 45 },
  { rating: 2, count: 78 },
  { rating: 3, count: 124 },
  { rating: 4, count: 67 },
  { rating: 5, count: 23 },
];

export const mockTrendingPosts: ProcessedPost[] = [
  {
    id: "1",
    subreddit: "wallstreetbets",
    title: "ASTS: Why AST SpaceMobile Could Be the Next Big Play",
    content:
      "Deep analysis of AST SpaceMobile's satellite constellation and upcoming commercial launch timeline...",
    author: "DeepValueHunter",
    summary:
      "AST SpaceMobile is building the first space-based cellular broadband network. With upcoming satellite launches and growing carrier partnerships, this could be a multi-bagger opportunity.",
    sentiment: "bullish",
    sentimentScore: 0.85,
    tickers: ["ASTS"],
    ddQualityScore: 4.5,
    flair: "DD",
    upvotes: 2847,
    numComments: 432,
    upvoteRatio: 0.92,
    createdUtc: new Date("2026-04-06T14:30:00Z"),
    url: "https://reddit.com/r/wallstreetbets/1",
  },
  {
    id: "2",
    subreddit: "wallstreetbets",
    title: "PLTR: Government Contract Pipeline Analysis Q1 2026",
    content:
      "Detailed breakdown of Palantir's government contract wins and pipeline...",
    author: "GovContractAnalyst",
    summary:
      "Palantir's government contract pipeline has expanded 40% YoY with AIP adoption accelerating across defense and intelligence agencies. Commercial growth trajectory also strong.",
    sentiment: "bullish",
    sentimentScore: 0.72,
    tickers: ["PLTR"],
    ddQualityScore: 4.8,
    flair: "DD",
    upvotes: 1923,
    numComments: 287,
    upvoteRatio: 0.89,
    createdUtc: new Date("2026-04-06T12:15:00Z"),
    url: "https://reddit.com/r/wallstreetbets/2",
  },
  {
    id: "3",
    subreddit: "wallstreetbets",
    title: "NVDA: The AI Infrastructure Build-Out is Just Getting Started",
    content:
      "Analysis of Nvidia's data center revenue trajectory and competitive moat...",
    author: "ChipAnalysis",
    summary:
      "Nvidia's data center revenue continues to accelerate with Blackwell ramp. Competitive threats from AMD and custom ASICs are overstated given CUDA ecosystem lock-in.",
    sentiment: "bullish",
    sentimentScore: 0.91,
    tickers: ["NVDA"],
    ddQualityScore: 4.2,
    flair: "DD",
    upvotes: 3156,
    numComments: 521,
    upvoteRatio: 0.88,
    createdUtc: new Date("2026-04-06T10:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/3",
  },
  {
    id: "4",
    subreddit: "wallstreetbets",
    title: "SOFI: Undervalued Fintech With Banking License Advantage",
    content:
      "Why SoFi's banking charter creates a structural advantage over other fintechs...",
    author: "FintechDD",
    summary:
      "SoFi's banking charter allows them to hold deposits at lower cost than competitors. Student loan resumption and expanding product suite create multiple growth vectors.",
    sentiment: "bullish",
    sentimentScore: 0.68,
    tickers: ["SOFI"],
    ddQualityScore: 4.0,
    flair: "DD",
    upvotes: 1245,
    numComments: 189,
    upvoteRatio: 0.85,
    createdUtc: new Date("2026-04-05T22:45:00Z"),
    url: "https://reddit.com/r/wallstreetbets/4",
  },
  {
    id: "5",
    subreddit: "wallstreetbets",
    title: "Why I'm Bearish on RIVN - Cash Burn Analysis",
    content: "Rivian's quarterly cash burn rate and path to profitability...",
    author: "AutoBearDD",
    summary:
      "Rivian is burning $1.5B+ per quarter with no clear path to profitability. VW partnership helps but production scaling issues persist. Overvalued at current levels.",
    sentiment: "bearish",
    sentimentScore: -0.65,
    tickers: ["RIVN"],
    ddQualityScore: 3.8,
    flair: "DD",
    upvotes: 876,
    numComments: 324,
    upvoteRatio: 0.72,
    createdUtc: new Date("2026-04-05T18:30:00Z"),
    url: "https://reddit.com/r/wallstreetbets/5",
  },
];
