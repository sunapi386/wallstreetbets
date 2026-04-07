import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WatchlistItem } from "@/lib/types";

const sentimentColor = {
  bullish: "bg-green-100 text-green-800",
  bearish: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-800",
};

export function WatchlistCard({ items }: { items: WatchlistItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.ticker}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold">{item.ticker}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.ddCount} DDs
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${sentimentColor[item.sentiment]}`}
                >
                  {item.sentiment}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">
                  ${item.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs ${item.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {item.changePercent >= 0 ? "+" : ""}
                  {item.changePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
