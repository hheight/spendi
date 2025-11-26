import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { getCategories, getExpensesByDateRange } from "@/lib/dal";
import {
  buildChartConfig,
  buildMonthlyChartData,
  filterExpensesByDay
} from "@/lib/utils";
import FormattedAmount from "@/components/formatted-amount";
import ExpensesList from "@/components/expenses/list";
import MonthlyBarChart from "@/components/monthly-bar-chart";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { selectedDay = null } = await searchParams;

  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();

  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0));

  const [categories, expenses] = await Promise.all([
    getCategories(),
    getExpensesByDateRange(startDate, endDate)
  ]);

  if (!categories || !expenses) {
    return null;
  }

  const chartConfig = buildChartConfig(categories);
  const monthlyChartData = buildMonthlyChartData(expenses, endDate.getUTCDate());
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
              {today.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
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
                : new Date(Date.UTC(year, month, Number(selectedDay))).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }
                  )}
            </p>
            <FormattedAmount
              className="text-xl before:text-base"
              amount={
                selectedDay === null ? totalSpent / endDate.getUTCDate() : spentByDay
              }
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <MonthlyBarChart chartData={monthlyChartData} chartConfig={chartConfig} />
          <div className="mt-8">
            <ExpensesList expenses={selectedDay === null ? expenses : expensesByDay} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
