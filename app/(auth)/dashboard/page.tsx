import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { getCategories, getExpensesByDateRange, getFirstExpense } from "@/lib/dal";
import {
  buildChartConfig,
  buildChartData,
  calculateTotalAmount,
  createDateFromDay,
  getCurrentMonthRange,
  parseSelectedDay,
  parseSelectedMonth
} from "@/lib/utils";
import FormattedAmount from "@/components/formatted-amount";
import CompletedExpensesList from "@/components/expenses/completed-list";
import MonthlyBarChart from "@/components/monthly-bar-chart";
import { format, getDate } from "date-fns";
import MonthSelect from "@/components/month-select";
import { filterExpensesByDay } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedMonth = parseSelectedMonth(params.month);
  const currentDate = selectedMonth || new Date();
  const monthRange = getCurrentMonthRange(currentDate);

  const selectedDayParam = parseSelectedDay(params.day);
  const highlightedDate = selectedDayParam
    ? createDateFromDay(selectedDayParam, currentDate)
    : null;

  const [categories, monthlyExpenses, firstExpense] = await Promise.all([
    getCategories(),
    getExpensesByDateRange(monthRange.start, currentDate),
    getFirstExpense()
  ]);

  if (categories === null || monthlyExpenses === null) {
    notFound();
  }

  const totalSpent = calculateTotalAmount(monthlyExpenses);
  let selectedExpenses = monthlyExpenses;
  let amountSpent = totalSpent / getDate(currentDate);

  if (selectedDayParam) {
    const dayExpenses = filterExpensesByDay(monthlyExpenses, selectedDayParam);
    const dayTotal = calculateTotalAmount(dayExpenses);

    selectedExpenses = dayExpenses ?? [];
    amountSpent = dayTotal ?? 0;
  }

  const chartConfig = buildChartConfig(categories);
  const chartData = buildChartData(monthlyExpenses, getDate(monthRange.end));

  return (
    <div className="flex flex-col gap-4">
      <Card className="mx-auto flex w-full flex-col">
        <CardHeader className="flex w-full items-center justify-between">
          <div>
            <MonthSelect startDate={firstExpense?.createdAt} />
            <FormattedAmount
              className="text-xl before:text-base"
              amount={totalSpent}
              negativeValue
            />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase">
              {highlightedDate === null
                ? "Spent/day"
                : format(highlightedDate, "d MMM yyyy")}
            </p>
            <FormattedAmount className="text-xl before:text-base" amount={amountSpent} />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <MonthlyBarChart chartData={chartData} chartConfig={chartConfig} />
          <div className="mt-8">
            <CompletedExpensesList expenses={selectedExpenses} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
