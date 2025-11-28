import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { getCategories, getExpensesByDateRange } from "@/lib/dal";
import {
  buildChartConfig,
  buildMonthlyChartData,
  filterExpensesByDay
} from "@/lib/utils";
import FormattedAmount from "@/components/formatted-amount";
import CompletedExpensesList from "@/components/expenses/completed-list";
import MonthlyBarChart from "@/components/monthly-bar-chart";
import { format, endOfMonth, startOfMonth, getYear, getMonth, getDate } from "date-fns";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { selectedDay = null } = await searchParams;

  const now = new Date();

  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);

  const [categories, expenses] = await Promise.all([
    getCategories(),
    getExpensesByDateRange(startMonth, now)
  ]);

  if (!categories || !expenses) {
    return null;
  }

  const chartConfig = buildChartConfig(categories);
  const monthlyChartData = buildMonthlyChartData(expenses, getDate(endMonth));
  const totalSpent = expenses.reduce<number>((acc, curr) => {
    return (acc += curr.value);
  }, 0);

  const { expensesByDay, spentByDay } = filterExpensesByDay(
    expenses,
    Number(selectedDay)
  );

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
              {selectedDay === null
                ? "Spent/day"
                : format(
                    new Date(getYear(now), getMonth(now), Number(selectedDay)),
                    "d MMM yyyy"
                  )}
            </p>
            <FormattedAmount
              className="text-xl before:text-base"
              amount={selectedDay === null ? totalSpent / getDate(endMonth) : spentByDay}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <MonthlyBarChart chartData={monthlyChartData} chartConfig={chartConfig} />
          <div className="mt-8">
            <CompletedExpensesList
              expenses={selectedDay === null ? expenses : expensesByDay}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
