"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { ExpensesChartItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  chartData: ExpensesChartItem[];
  chartConfig: ChartConfig;
};

const visibleDays = [1, 8, 15, 22, 28];

function formatToK(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.?0+$/, "") + "k";
  }
  return num.toString();
}

export default function MonthlyBarChart({ chartData, chartConfig }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDay = searchParams.get("day");

  const handleBarClick = (item: { day: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", item.day.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <YAxis
          dataKey="value"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickCount={3}
          width={35}
          tickFormatter={formatToK}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => (visibleDays.includes(value) ? value : "")}
        />
        <Bar
          dataKey="value"
          fill="var(--chart-1)"
          background={{ fill: "var(--muted)", radius: 4 }}
          radius={4}
          onClick={handleBarClick}
        >
          {chartData.map(entry => (
            <Cell
              className="duration-200"
              cursor="pointer"
              fillOpacity={
                selectedDay === null ? 1 : Number(selectedDay) === entry.day ? 1 : 0.5
              }
              key={`cell-${entry.day}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
