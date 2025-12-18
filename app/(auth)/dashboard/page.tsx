import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ExpensesList from "@/components/expenses/list";
import Chart from "@/components/dashboard/chart";
import type { Metadata } from "next";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";
import ChartHeader from "@/components/dashboard/chart-header";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ day?: string; month?: string }>;
}) {
  const params = await searchParams;

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
      <PageTitle text="Dashboard" />
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
