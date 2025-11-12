import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Card, CardContent } from "@/components/ui/card";

import PieChart from "@/components/pie-chart";
import { getCategories, getExpensesByCategory, getUserIncome } from "@/lib/dal";
import { buildChartData, getBalance } from "@/lib/utils";
import { BanknoteX } from "lucide-react";
import BalanceCard from "@/components/balance-card";

function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mx-auto flex w-full flex-col">
      <CardContent className="flex-1 pb-0">{children}</CardContent>
    </Card>
  );
}

export default async function Page() {
  const [categories, expenses, userIncome] = await Promise.all([
    getCategories(),
    getExpensesByCategory(),
    getUserIncome()
  ]);

  if (!categories || !expenses || !userIncome) {
    return null;
  }

  if (expenses.length === 0) {
    return (
      <CardContainer>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BanknoteX />
            </EmptyMedia>
            <EmptyTitle>No Data</EmptyTitle>
            <EmptyDescription>Get started by adding expenses.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent></EmptyContent>
        </Empty>
      </CardContainer>
    );
  }

  const { chartData, chartConfig } = buildChartData(categories, expenses);
  const { balance, expenseSum } = getBalance(chartData, userIncome);

  return (
    <>
      <div className="mb-4">
        <BalanceCard balance={balance} expenses={expenseSum} income={userIncome.income} />
      </div>
      <CardContainer>
        <PieChart chartData={chartData} chartConfig={chartConfig} />
      </CardContainer>
    </>
  );
}
