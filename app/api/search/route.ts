import { NextRequest } from "next/server";
import { semanticSearch } from "@/lib/db/weaviate";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "10", 10);

  if (!query) {
    return Response.json({ error: "q query param required" }, { status: 400 });
  }

  if (!process.env.WEAVIATE_URL) {
    return Response.json(
      { error: "Weaviate not configured" },
      { status: 503 },
    );
  }

  try {
    const results = await semanticSearch(query, limit);
    return Response.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
