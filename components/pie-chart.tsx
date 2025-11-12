"use client";

import { Legend, LabelList, Pie, PieChart as RoundedPieChart } from "recharts";

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
      className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
    >
      <RoundedPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
        <Pie
          data={chartData}
          innerRadius={30}
          dataKey="value"
          radius={10}
          cornerRadius={8}
          paddingAngle={4}
        >
          <LabelList
            dataKey="value"
            stroke="none"
            fontSize={12}
            fontWeight={500}
            fill="currentColor"
            formatter={(value: number) => value.toString()}
          />
        </Pie>
        <Legend />
      </RoundedPieChart>
    </ChartContainer>
  );
}
