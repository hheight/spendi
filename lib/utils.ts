import type { ChartConfig, ChartItem } from "@/components/ui/chart";
import type { CategoryPreview, ExpenseByCategory, UserIncome } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTextColorClass(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "text-black" : "text-white";
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
