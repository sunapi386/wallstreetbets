import { NextRequest } from "next/server";
import { getRecentPosts, getTrendingPosts } from "@/lib/db/clickhouse";
import { mockTrendingPosts } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const minQuality = parseFloat(searchParams.get("minQuality") ?? "0");

  if (!process.env.CLICKHOUSE_URL) {
    return Response.json(mockTrendingPosts);
  }

  try {
    const posts =
      minQuality > 0
        ? await getTrendingPosts(minQuality, limit)
        : await getRecentPosts(limit);
    return Response.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return Response.json(mockTrendingPosts);
  }
}
