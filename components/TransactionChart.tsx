"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  trend: { label: "Transaction", color: "#2563eb" },
};

type Props = {
  data: { month: string; value: number }[];
};

export function TransactionChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <Bar dataKey="value" radius={4} fill="#2563eb" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
      </BarChart>
    </ChartContainer>
  );
}
