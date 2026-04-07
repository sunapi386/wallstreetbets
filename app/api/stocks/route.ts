import { NextRequest } from "next/server";
import { getQuotes, getMarketIndices } from "@/lib/stocks/prices";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tickers = searchParams.get("tickers");
  const type = searchParams.get("type");

  try {
    if (type === "indices") {
      const indices = await getMarketIndices();
      return Response.json(indices);
    }

    if (!tickers) {
      return Response.json(
        { error: "tickers query param required" },
        { status: 400 },
      );
    }

    const quotes = await getQuotes(tickers.split(","));
    return Response.json(quotes);
  } catch (error) {
    console.error("Stock API error:", error);
    return Response.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
