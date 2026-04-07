import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketIndex } from "@/lib/types";

export function MarketOverview({ indices }: { indices: MarketIndex[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {indices.map((index) => {
        const isPositive = index.changePercent >= 0;
        return (
          <Card key={index.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {index.name}
              </CardTitle>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {index.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p
                className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {isPositive ? "+" : ""}
                {index.change.toFixed(2)} ({isPositive ? "+" : ""}
                {index.changePercent.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
