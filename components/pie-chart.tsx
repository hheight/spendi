"use client";

import { Legend, Pie, PieChart as RoundedPieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

type Props = {
  chartData: {
    name: string;
    value: number;
    fill: string;
  }[];
  chartConfig: ChartConfig;
};

export default function PieChart({ chartData, chartConfig }: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className="[&_.recharts-text]:fill-background [&_.recharts-legend-item-text]:text-foreground mx-auto aspect-square max-h-[250px]"
    >
      <RoundedPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
        <Pie
          data={chartData}
          innerRadius={30}
          radius={10}
          cornerRadius={4}
          paddingAngle={2}
          dataKey="value"
        />
        <Legend />
      </RoundedPieChart>
    </ChartContainer>
  );
}
