"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  trend: {
    label: "Transaction",
    color: "#2563eb",
  },
};

const chartData = [
  {
    month: "January",
    value: 35000,
  },
  {
    month: "February",
    value: 15000,
  },
  {
    month: "March",
    value: 25000,
  },
  {
    month: "April",
    value: 45000,
  },
  {
    month: "May",
    value: 50000,
  },
  {
    month: "June",
    value: 35000,
  },
  {
    month: "July",
    value: 15000,
  },
  {
    month: "August",
    value: 25000,
  },
  {
    month: "September",
    value: 45000,
  },
  {
    month: "October",
    value: 50000,
  },
];

export function TransactionChart() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="value" radius={4} fill="var(--color-blue-500)" />
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
