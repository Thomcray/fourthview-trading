"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

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

type Props = {
  data: {
    month: string;
    value: number;
  }[];
};

export function TransactionChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => String(value).slice(0, 3)}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `₦${Number(value).toLocaleString("en-NG")}`}
        />

        <ChartTooltip
          cursor={{ fill: "rgba(37, 99, 235, 0.05)" }}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span>
                  ₦
                  {Number(value).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            />
          }
        />

        <Bar
          dataKey="value"
          name="Transaction"
          fill="var(--color-trend)"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ChartContainer>
  );
}
