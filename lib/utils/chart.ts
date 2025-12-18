import type { ExpenseByDateRange, ExpensesChartItem } from "@/types";
import { getDate, format, getYear, getMonth } from "date-fns";

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

export function buildMonthSelectOptions(date?: Date) {
  const now = new Date();
  const startYear = getYear(date || now);
  const startMonth = getMonth(date || now);
  const endYear = getYear(now);
  const endMonth = getMonth(now);

  const options: Array<{ label: string; value: string }> = [];

  let currentYear = endYear;
  let currentMonth = endMonth;

  while (
    currentYear > startYear ||
    (currentYear === startYear && currentMonth >= startMonth)
  ) {
    const optionDate = new Date(currentYear, currentMonth, 1);

    options.push({
      label: format(optionDate, "MMM yyyy"),
      value: format(optionDate, "yyyy-MM")
    });

    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }

  return options;
}

export function calculateTotalAmount(expenses: ExpenseByDateRange[]): number {
  return expenses.reduce((sum, e) => sum + e.value, 0);
}
