"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import type { SentimentBreakdown } from "@/lib/types";

const COLORS = {
  bullish: "#22c55e",
  neutral: "#94a3b8",
  bearish: "#ef4444",
};

const chartConfig = {
  bullish: { label: "Bullish", color: COLORS.bullish },
  neutral: { label: "Neutral", color: COLORS.neutral },
  bearish: { label: "Bearish", color: COLORS.bearish },
};

export function SentimentChart({ data }: { data: SentimentBreakdown }) {
  const chartData = [
    { name: "Bullish", value: data.bullish, fill: COLORS.bullish },
    { name: "Neutral", value: data.neutral, fill: COLORS.neutral },
    { name: "Bearish", value: data.bearish, fill: COLORS.bearish },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reddit Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex justify-center gap-4 text-sm">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-muted-foreground">
                {entry.name} {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
