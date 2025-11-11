import type { ChartConfig } from "@/components/ui/chart";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type Category = {
  id: string;
  name: string;
  color: string;
};

type ExpenseByCategory = {
  categoryId: string;
  _sum: {
    value: number | null;
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildChartData(categories: Category[], expenses: ExpenseByCategory[]) {
  const expenseMap = new Map(expenses.map(e => [e.categoryId, e._sum.value ?? 0]));

  const chartData = categories
    .map(category => ({
      name: category.name,
      value: expenseMap.get(category.id) ?? 0,
      fill: `var(--color-${category.name.toLowerCase().replace(/\s+/g, "-")})`
    }))
    .filter(item => item.value > 0);

  const chartConfig = categories.reduce((config, category) => {
    const key = category.name.toLowerCase().replace(/\s+/g, "-");
    config[key] = {
      label: category.name,
      color: category.color
    };
    return config;
  }, {} as ChartConfig);

  return { chartData, chartConfig };
}
