import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopMentionedTickers } from "@/lib/db/clickhouse";
import { getQuotes } from "@/lib/stocks/prices";

export const revalidate = 60;

interface ScreenerRow {
  ticker: string;
  price: number | null;
  changePercent: number | null;
  mentions: number;
  avgSentiment: number;
}

async function getScreenerData(): Promise<ScreenerRow[]> {
  // Default mock data when no DB is connected
  const mockData: ScreenerRow[] = [
    { ticker: "NVDA", price: 875.28, changePercent: 2.1, mentions: 15, avgSentiment: 0.85 },
    { ticker: "ASTS", price: 28.45, changePercent: 5.2, mentions: 12, avgSentiment: 0.78 },
    { ticker: "PLTR", price: 72.31, changePercent: -1.3, mentions: 8, avgSentiment: 0.65 },
    { ticker: "TSLA", price: 245.62, changePercent: -0.7, mentions: 6, avgSentiment: 0.1 },
    { ticker: "SOFI", price: 9.87, changePercent: 3.4, mentions: 4, avgSentiment: 0.55 },
    { ticker: "AMD", price: 162.45, changePercent: 1.8, mentions: 4, avgSentiment: 0.72 },
    { ticker: "RIVN", price: 14.23, changePercent: -2.5, mentions: 3, avgSentiment: -0.45 },
    { ticker: "COIN", price: 225.67, changePercent: 4.1, mentions: 3, avgSentiment: 0.62 },
    { ticker: "INTC", price: 31.45, changePercent: -1.2, mentions: 2, avgSentiment: -0.55 },
    { ticker: "SHOP", price: 89.12, changePercent: 0.9, mentions: 2, avgSentiment: 0.68 },
  ];

  if (!process.env.CLICKHOUSE_URL) return mockData;

  try {
    const topTickers = await getTopMentionedTickers(20);
    if (topTickers.length === 0) return mockData;

    const quotes = await getQuotes(topTickers.map((t) => t.ticker));
    const quoteMap = new Map(quotes.map((q) => [q.ticker, q]));

    return topTickers.map((t) => {
      const quote = quoteMap.get(t.ticker);
      return {
        ticker: t.ticker,
        price: quote?.price ?? null,
        changePercent: quote?.changePercent ?? null,
        mentions: t.mentions,
        avgSentiment: t.avgSentiment,
      };
    });
  } catch {
    return mockData;
  }
}

function sentimentLabel(score: number): { text: string; className: string } {
  if (score > 0.3) return { text: "Bullish", className: "bg-green-100 text-green-800" };
  if (score < -0.3) return { text: "Bearish", className: "bg-red-100 text-red-800" };
  return { text: "Neutral", className: "bg-gray-100 text-gray-800" };
}

export default async function ScreenerPage() {
  const data = await getScreenerData();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <h2 className="text-lg font-semibold">Stock Screener</h2>
      </header>
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Mentioned Tickers (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Mentions</TableHead>
                  <TableHead>Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => {
                  const sentiment = sentimentLabel(row.avgSentiment);
                  return (
                    <TableRow key={row.ticker}>
                      <TableCell className="font-mono font-semibold">
                        {row.ticker}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.price !== null ? `$${row.price.toFixed(2)}` : "--"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          (row.changePercent ?? 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.changePercent !== null
                          ? `${row.changePercent >= 0 ? "+" : ""}${row.changePercent.toFixed(1)}%`
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">{row.mentions}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${sentiment.className}`}
                        >
                          {sentiment.text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
