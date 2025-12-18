import { getExpensesByDateRange, getFirstExpense } from "@/lib/dal";
import {
  parseSelectedMonth,
  parseSelectedDay,
  getCurrentMonthRange,
  filterExpensesByDay,
  calculateTotalAmount,
  createDateFromDay,
  buildChartData,
  buildMonthSelectOptions
} from "@/lib/utils";
import { getDate } from "date-fns";

export async function getDashboardData(month?: string, day?: string) {
  const currentDate = parseSelectedMonth(month) || new Date();
  const selectedDayParam = parseSelectedDay(day);
  const monthRange = getCurrentMonthRange(currentDate);

  const [monthlyExpenses, firstExpense] = await Promise.all([
    getExpensesByDateRange(monthRange.start, currentDate),
    getFirstExpense()
  ]);

  const totalSpent = calculateTotalAmount(monthlyExpenses);

  const selectedExpenses = selectedDayParam
    ? filterExpensesByDay(monthlyExpenses, selectedDayParam)
    : monthlyExpenses;

  const amountSpent = selectedDayParam
    ? calculateTotalAmount(selectedExpenses)
    : totalSpent / getDate(currentDate);

  const highlightedDate = selectedDayParam
    ? createDateFromDay(selectedDayParam, currentDate)
    : null;

  const monthSelectOptions = buildMonthSelectOptions(firstExpense?.createdAt);
  const chartData = buildChartData(monthlyExpenses, getDate(monthRange.end));

  return {
    totalSpent,
    amountSpent,
    selectedExpenses,
    highlightedDate,
    chartData,
    monthSelectOptions,
    monthRange
  };
}
