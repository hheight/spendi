import type { ChartConfig, ChartItem } from "@/components/ui/chart";
import type { CategoryPreview, ExpenseByCategory, UserIncome } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildChartData(
  categories: CategoryPreview[],
  expenses: ExpenseByCategory[]
): { chartData: ChartItem[]; chartConfig: ChartConfig } {
  const expenseMap = new Map(expenses.map(e => [e.categoryId, e._sum?.value ?? 0]));

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

export function getBalance(chartData: ChartItem[], userIncome: UserIncome) {
  const expenseSum = chartData.reduce((sum, { value }) => sum + value, 0);
  const balance = userIncome.income - expenseSum;

  return { balance, expenseSum };
}
