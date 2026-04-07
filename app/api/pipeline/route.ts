import { NextRequest } from "next/server";
import { runPipeline } from "@/lib/pipeline/processor";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes (Vercel Pro)

export async function POST(request: NextRequest) {
  // Authenticate cron requests
  const authHeader = request.headers.get("authorization");
  const pipelineSecret = process.env.PIPELINE_SECRET;

  if (pipelineSecret && authHeader !== `Bearer ${pipelineSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check required env vars
  if (!process.env.REDDIT_CLIENT_ID || !process.env.ANTHROPIC_API_KEY || !process.env.CLICKHOUSE_URL) {
    return Response.json(
      { error: "Missing required environment variables (REDDIT_CLIENT_ID, ANTHROPIC_API_KEY, CLICKHOUSE_URL)" },
      { status: 500 },
    );
  }

  try {
    const result = await runPipeline("wallstreetbets", 50);
    return Response.json(result);
  } catch (error) {
    console.error("[Pipeline API] Error:", error);
    return Response.json(
      { error: "Pipeline failed", details: String(error) },
      { status: 500 },
    );
  }
}

// Also support GET for Vercel Cron (cron sends GET requests)
export async function GET(request: NextRequest) {
  return POST(request);
}
