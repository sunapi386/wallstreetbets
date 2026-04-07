"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: { label: "Posts", color: "var(--chart-1)" },
};

export function DDQualityChart({
  data,
}: {
  data: { rating: number; count: number }[];
}) {
  const chartData = data.map((d) => ({
    rating: `${d.rating} star`,
    count: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">DD Quality Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart data={chartData}>
            <XAxis dataKey="rating" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
