import { getSentimentBreakdown } from "@/lib/db/clickhouse";
import { mockSentiment } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.CLICKHOUSE_URL) {
    return Response.json(mockSentiment);
  }

  try {
    const breakdown = await getSentimentBreakdown();
    return Response.json(breakdown);
  } catch (error) {
    console.error("Failed to fetch sentiment:", error);
    return Response.json(mockSentiment);
  }
}
