"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartData = [
  {
    name: "Food",
    value: 540,
    fill: "var(--color-food)"
  },
  {
    name: "Housing",
    value: 1200,
    fill: "var(--color-housing)"
  },
  {
    name: "Transportation",
    value: 727,
    fill: "var(--color-transportation)"
  },
  {
    name: "Utilities",
    value: 900,
    fill: "var(--color-utilities)"
  }
];

const chartConfig = {
  food: {
    label: "Food",
    color: "#00ff00"
  },
  housing: {
    label: "Housing",
    color: "#c0ffee"
  },
  transportation: {
    label: "Transportation",
    color: "#bada55"
  },
  utilities: {
    label: "Utilities",
    color: "#aaaaff"
  }
} satisfies ChartConfig;

export default function RoundedPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          Expenses Chart
          <Badge
            variant="outline"
            className="ml-2 border-none bg-green-500/10 text-green-500"
          >
            <TrendingUp className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey="value"
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
              isAnimationActive={false}
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
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
