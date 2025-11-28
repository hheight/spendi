import type { ChartConfig } from "@/components/ui/chart";
import type { CategoryPreview, ExpenseByDateRange, ExpensesChartItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { getDate } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildChartConfig(categories: CategoryPreview[]): ChartConfig {
  return categories.reduce((config, category) => {
    const key = category.name.toLowerCase().replace(/\s+/g, "-");
    config[key] = {
      label: category.name,
      color: category.color
    };
    return config;
  }, {} as ChartConfig);
}

export function buildMonthlyChartData(
  expenses: ExpenseByDateRange[],
  length: number
): ExpensesChartItem[] {
  const chartData = Array.from({ length }, (_, i) => {
    const foundItems = expenses.filter(expense => getDate(expense.createdAt) === i + 1);

    if (foundItems.length === 0) {
      return {
        day: i + 1
      };
    }

    return foundItems.reduce<ExpensesChartItem>(
      (acc, currentValue) => {
        acc.value += currentValue.value;
        return acc;
      },
      { day: i + 1, value: 0 }
    );
  });

  return chartData;
}

export function filterExpensesByDay(expenses: ExpenseByDateRange[], day: number) {
  let spentByDay = 0;

  const expensesByDay = expenses.filter(expense => {
    const dayCreated = getDate(expense.createdAt);
    if (day === dayCreated) {
      spentByDay += expense.value;
      return true;
    }
  });

  return { spentByDay, expensesByDay };
}
