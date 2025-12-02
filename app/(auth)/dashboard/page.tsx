import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  getCategories,
  getExpensesByDateRange,
  getExpensesTotalByDateRange
} from "@/lib/dal";
import {
  buildChartConfig,
  buildChartData,
  createDateFromDay,
  getCurrentMonthRange,
  getDayRange,
  parseSelectedDay
} from "@/lib/utils";
import FormattedAmount from "@/components/formatted-amount";
import CompletedExpensesList from "@/components/expenses/completed-list";
import MonthlyBarChart from "@/components/monthly-bar-chart";
import { format, getDate } from "date-fns";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const monthRange = getCurrentMonthRange(now);

  const selectedDayParam = parseSelectedDay(params.selectedDay);
  const selectedDate = selectedDayParam ? createDateFromDay(selectedDayParam, now) : null;

  const [categories, expenses, totalSpent] = await Promise.all([
    getCategories(),
    getExpensesByDateRange(monthRange.start, now),
    getExpensesTotalByDateRange(monthRange.start, now)
  ]);

  if (categories === null || expenses === null || totalSpent === null) {
    return null;
  }

  let selectedExpenses = expenses;
  let amountSpent = totalSpent / getDate(now);

  if (selectedDate) {
    const dayRange = getDayRange(selectedDate);
    const [dayExpenses, dayTotal] = await Promise.all([
      getExpensesByDateRange(dayRange.start, dayRange.end),
      getExpensesTotalByDateRange(dayRange.start, dayRange.end)
    ]);

    selectedExpenses = dayExpenses ?? [];
    amountSpent = dayTotal ?? 0;
  }

  const chartConfig = buildChartConfig(categories);
  const chartData = buildChartData(expenses, getDate(monthRange.end));

  return (
    <div className="flex flex-col gap-4">
      <Card className="mx-auto flex w-full flex-col">
        <CardHeader className="flex w-full items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase">
              {format(now, "MMM yyyy")}
            </p>
            <FormattedAmount
              className="text-xl before:text-base"
              amount={totalSpent}
              negativeValue
            />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase">
              {selectedDate === null ? "Spent/day" : format(selectedDate, "d MMM yyyy")}
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
