/**
 * Seed script: populates ClickHouse with test data.
 * Usage: npx tsx --env-file=.env.local scripts/seed.ts
 */
import { initSchema, insertPosts } from "../lib/db/clickhouse";
import type { ProcessedPost } from "../lib/types";

const seedPosts: ProcessedPost[] = [
  {
    id: "seed_1",
    subreddit: "wallstreetbets",
    title: "ASTS: Why AST SpaceMobile Could Be the Next Big Play",
    content:
      "Deep analysis of AST SpaceMobile's satellite constellation and upcoming commercial launch timeline. The company has secured partnerships with major carriers and is on track for commercial service in 2026.",
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
    url: "https://reddit.com/r/wallstreetbets/seed_1",
  },
  {
    id: "seed_2",
    subreddit: "wallstreetbets",
    title: "PLTR: Government Contract Pipeline Analysis Q1 2026",
    content:
      "Detailed breakdown of Palantir's government contract wins and pipeline for the first quarter of 2026.",
    author: "GovContractAnalyst",
    summary:
      "Palantir's government contract pipeline has expanded 40% YoY with AIP adoption accelerating across defense and intelligence agencies.",
    sentiment: "bullish",
    sentimentScore: 0.72,
    tickers: ["PLTR"],
    ddQualityScore: 4.8,
    flair: "DD",
    upvotes: 1923,
    numComments: 287,
    upvoteRatio: 0.89,
    createdUtc: new Date("2026-04-06T12:15:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_2",
  },
  {
    id: "seed_3",
    subreddit: "wallstreetbets",
    title: "NVDA: The AI Infrastructure Build-Out is Just Getting Started",
    content:
      "Analysis of Nvidia's data center revenue trajectory and competitive moat in the AI chip market.",
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
    url: "https://reddit.com/r/wallstreetbets/seed_3",
  },
  {
    id: "seed_4",
    subreddit: "wallstreetbets",
    title: "SOFI: Undervalued Fintech With Banking License Advantage",
    content:
      "Why SoFi's banking charter creates a structural advantage over other fintechs.",
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
    url: "https://reddit.com/r/wallstreetbets/seed_4",
  },
  {
    id: "seed_5",
    subreddit: "wallstreetbets",
    title: "Why I'm Bearish on RIVN - Cash Burn Analysis",
    content:
      "Rivian's quarterly cash burn rate and path to profitability analysis.",
    author: "AutoBearDD",
    summary:
      "Rivian is burning $1.5B+ per quarter with no clear path to profitability. VW partnership helps but production scaling issues persist.",
    sentiment: "bearish",
    sentimentScore: -0.65,
    tickers: ["RIVN"],
    ddQualityScore: 3.8,
    flair: "DD",
    upvotes: 876,
    numComments: 324,
    upvoteRatio: 0.72,
    createdUtc: new Date("2026-04-05T18:30:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_5",
  },
  {
    id: "seed_6",
    subreddit: "wallstreetbets",
    title: "AMD: Underappreciated AI Play With MI300X Momentum",
    content:
      "AMD's data center GPU business is inflecting with MI300X wins at major cloud providers.",
    author: "SemiDD",
    summary:
      "AMD MI300X is gaining real traction at Microsoft Azure and Meta. While NVDA dominates training, AMD is carving out inference market share at better price/performance.",
    sentiment: "bullish",
    sentimentScore: 0.75,
    tickers: ["AMD"],
    ddQualityScore: 4.1,
    flair: "DD",
    upvotes: 1567,
    numComments: 234,
    upvoteRatio: 0.87,
    createdUtc: new Date("2026-04-05T16:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_6",
  },
  {
    id: "seed_7",
    subreddit: "wallstreetbets",
    title: "TSLA: Robotaxi Timeline Reality Check",
    content:
      "A balanced look at Tesla's autonomous driving progress and realistic robotaxi timeline.",
    author: "EVRealist",
    summary:
      "Tesla FSD v13 shows real improvement but regulatory hurdles remain. Robotaxi revenue is likely 2027+ not 2026. Current valuation already prices in optimistic scenarios.",
    sentiment: "neutral",
    sentimentScore: 0.05,
    tickers: ["TSLA"],
    ddQualityScore: 3.5,
    flair: "DD",
    upvotes: 2134,
    numComments: 567,
    upvoteRatio: 0.65,
    createdUtc: new Date("2026-04-05T14:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_7",
  },
  {
    id: "seed_8",
    subreddit: "wallstreetbets",
    title: "SHOP: Shopify Is Building the Commerce OS",
    content:
      "How Shopify's platform strategy is creating a winner-take-most e-commerce infrastructure play.",
    author: "SaaSBull",
    summary:
      "Shopify's merchant solutions revenue is growing 25%+ YoY with improving margins. The checkout extensibility platform and Shop Pay adoption create powerful network effects.",
    sentiment: "bullish",
    sentimentScore: 0.78,
    tickers: ["SHOP"],
    ddQualityScore: 4.3,
    flair: "DD",
    upvotes: 987,
    numComments: 156,
    upvoteRatio: 0.91,
    createdUtc: new Date("2026-04-04T20:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_8",
  },
  {
    id: "seed_9",
    subreddit: "wallstreetbets",
    title: "COIN: Crypto Winter Is Over - Coinbase Earnings Preview",
    content: "Why Coinbase is positioned to benefit from the crypto recovery.",
    author: "CryptoFundamentals",
    summary:
      "Bitcoin ETF approval has driven institutional adoption. Coinbase Base L2 chain and staking revenue diversify beyond trading fees. Q1 earnings should surprise to the upside.",
    sentiment: "bullish",
    sentimentScore: 0.82,
    tickers: ["COIN"],
    ddQualityScore: 3.7,
    flair: "DD",
    upvotes: 1876,
    numComments: 445,
    upvoteRatio: 0.78,
    createdUtc: new Date("2026-04-04T15:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_9",
  },
  {
    id: "seed_10",
    subreddit: "wallstreetbets",
    title: "INTC: Intel's Foundry Bet Is Failing - Short Thesis",
    content:
      "Analysis of Intel's foundry struggles and why the stock has further to fall.",
    author: "BearishOnBlue",
    summary:
      "Intel 18A process is behind schedule. Foundry customer pipeline is thin. TSMC's lead is widening. Restructuring costs will weigh on earnings for years.",
    sentiment: "bearish",
    sentimentScore: -0.72,
    tickers: ["INTC"],
    ddQualityScore: 4.0,
    flair: "DD",
    upvotes: 1234,
    numComments: 389,
    upvoteRatio: 0.71,
    createdUtc: new Date("2026-04-04T10:00:00Z"),
    url: "https://reddit.com/r/wallstreetbets/seed_10",
  },
];

async function main() {
  console.log("Initializing ClickHouse schema...");
  await initSchema();
  console.log("Schema initialized.");

  console.log(`Inserting ${seedPosts.length} seed posts...`);
  await insertPosts(seedPosts);
  console.log("Seed data inserted successfully.");

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
