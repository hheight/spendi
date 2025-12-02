import type { ChartConfig } from "@/components/ui/chart";
import type { CategoryPreview, ExpenseByDateRange, ExpensesChartItem } from "@/types";
import { getDate } from "date-fns";

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

export function buildChartData(
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
