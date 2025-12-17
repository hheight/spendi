import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getExpensesByDateRange, getFirstExpense } from "@/lib/dal";
import {
  buildChartData,
  calculateTotalAmount,
  createDateFromDay,
  getCurrentMonthRange,
  parseSelectedDay,
  parseSelectedMonth
} from "@/lib/utils";
import FormattedAmount from "@/components/formatted-amount";
import CompletedExpensesList from "@/components/expenses/completed-list";
import DailyBarChart from "@/components/daily-bar-chart";
import { format, getDate } from "date-fns";
import MonthSelect from "@/components/month-select";
import { filterExpensesByDay } from "@/lib/utils";
import type { Metadata } from "next";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentDate = parseSelectedMonth(params.month) || new Date();
  const monthRange = getCurrentMonthRange(currentDate);

  const selectedDayParam = parseSelectedDay(params.day);
  const highlightedDate = selectedDayParam
    ? createDateFromDay(selectedDayParam, currentDate)
    : null;

  const [monthlyExpenses, firstExpense] = await Promise.all([
    getExpensesByDateRange(monthRange.start, currentDate),
    getFirstExpense()
  ]);

  const totalSpent = calculateTotalAmount(monthlyExpenses);
  let selectedExpenses = monthlyExpenses;
  let amountSpent = totalSpent / getDate(currentDate);

  if (selectedDayParam) {
    const dayExpenses = filterExpensesByDay(monthlyExpenses, selectedDayParam);
    const dayTotal = calculateTotalAmount(dayExpenses);

    selectedExpenses = dayExpenses ?? [];
    amountSpent = dayTotal ?? 0;
  }

  const chartData = buildChartData(monthlyExpenses, getDate(monthRange.end));

  return (
    <>
      <PageTitle text="Dashboard" />
      <Card>
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
        <CardContent className="space-y-8">
          <DailyBarChart chartData={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {selectedExpenses.length === 0 ? (
            <EmptyList />
          ) : (
            <CompletedExpensesList expenses={selectedExpenses} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
