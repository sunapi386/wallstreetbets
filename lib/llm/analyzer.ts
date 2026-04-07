import type { RedditPost } from "@/lib/reddit/fetcher";

export interface PostAnalysis {
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  tickers: string[];
  ddQualityScore: number;
}

const SYSTEM_PROMPT = `You analyze Reddit posts from r/wallstreetbets. For each post, return a JSON object with:
- summary: 2-3 sentence summary of the post's thesis
- sentiment: "bullish" | "bearish" | "neutral"
- sentimentScore: float from -1.0 (extremely bearish) to 1.0 (extremely bullish)
- tickers: array of stock ticker symbols mentioned (e.g. ["NVDA", "ASTS"]). Only include real traded US tickers. Convert company names to tickers.
- ddQualityScore: float from 1.0 to 5.0 (1=shitpost/meme, 3=decent analysis, 5=institutional-grade DD with data/sources)

Return ONLY valid JSON, no markdown fences.`;

type LLMProvider = "anthropic" | "openai";

function getProvider(): LLMProvider {
  if (process.env.LLM_PROVIDER) {
    return process.env.LLM_PROVIDER as LLMProvider;
  }
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error("No LLM API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
}

function getModel(): string {
  if (process.env.LLM_MODEL) return process.env.LLM_MODEL;
  const provider = getProvider();
  if (provider === "anthropic") return "claude-sonnet-4-20250514";
  return "gpt-4o-mini";
}

async function callLLM(userMessage: string): Promise<string> {
  const provider = getProvider();
  const model = getModel();

  if (provider === "anthropic") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic();
    const response = await client.messages.create({
      model,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  }

  // OpenAI (also works with any OpenAI-compatible API via OPENAI_BASE_URL)
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI();
  const response = await client.chat.completions.create({
    model,
    max_tokens: 512,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

export async function analyzePost(post: RedditPost): Promise<PostAnalysis> {
  const content = [post.title, post.selftext].filter(Boolean).join("\n\n");
  const truncated = content.slice(0, 4000);

  const userMessage = `Flair: ${post.link_flair_text ?? "none"}\n\nTitle: ${post.title}\n\nContent: ${truncated}`;
  const text = await callLLM(userMessage);
  const parsed = JSON.parse(text) as PostAnalysis;

  // Clamp values to valid ranges
  parsed.sentimentScore = Math.max(-1, Math.min(1, parsed.sentimentScore));
  parsed.ddQualityScore = Math.max(1, Math.min(5, parsed.ddQualityScore));
  if (!["bullish", "bearish", "neutral"].includes(parsed.sentiment)) {
    parsed.sentiment = "neutral";
  }

  return parsed;
}

export async function analyzePosts(
  posts: RedditPost[],
): Promise<Map<string, PostAnalysis>> {
  const results = new Map<string, PostAnalysis>();

  // Process in batches of 5 with concurrency
  const batchSize = 5;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const analyses = await Promise.allSettled(batch.map(analyzePost));

    for (let j = 0; j < batch.length; j++) {
      const result = analyses[j];
      if (result.status === "fulfilled") {
        results.set(batch[j].id, result.value);
      } else {
        console.error(
          `Failed to analyze post ${batch[j].id}:`,
          result.reason,
        );
      }
    }
  }

  return results;
}
