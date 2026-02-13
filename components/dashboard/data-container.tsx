import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ExpensesList from "@/components/expenses/list";
import Chart from "@/components/dashboard/chart";
import EmptyList from "@/components/empty-list";
import ChartHeader from "@/components/dashboard/chart-header";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardDataContainer({
  params
}: {
  params: { day?: string; month?: string };
}) {
  const {
    totalSpent,
    amountSpent,
    selectedExpenses,
    highlightedDate,
    chartData,
    monthSelectOptions
  } = await getDashboardData(params.month, params.day);

  return (
    <>
      <Card>
        <CardHeader className="flex w-full items-center justify-between">
          <ChartHeader
            totalSpent={totalSpent}
            amountSpent={amountSpent}
            highlightedDate={highlightedDate}
            monthSelectOptions={monthSelectOptions}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          <Chart chartData={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {selectedExpenses.length === 0 ? (
            <EmptyList />
          ) : (
            <ExpensesList expenses={selectedExpenses} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
