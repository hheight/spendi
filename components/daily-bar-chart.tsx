"use client";

import { Bar, BarChart, Cell, XAxis, YAxis, type BarRectangleItem } from "recharts";
import type { ExpensesChartItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  chartData: ExpensesChartItem[];
};

const visibleDays = [1, 8, 15, 22, 28];

function formatToK(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.?0+$/, "") + "k";
  }
  return num.toString();
}

export default function DailyBarChart({ chartData }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDay = searchParams.get("day");

  const handleBarClick = (item: BarRectangleItem) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", item.payload.day.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex aspect-video justify-center text-xs">
      <BarChart responsive data={chartData} style={{ minHeight: "200px", width: "100%" }}>
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
    </div>
  );
}
