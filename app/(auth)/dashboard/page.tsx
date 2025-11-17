import { Card, CardContent } from "@/components/ui/card";

import PieChart from "@/components/pie-chart";
import { getCategories, getExpensesByCategory, getUserIncome } from "@/lib/dal";
import { buildChartData, getBalance } from "@/lib/utils";
import BalanceCard from "@/components/balance-card";
import EmptyList from "@/components/empty-list";

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
        <EmptyList />
      </CardContainer>
    );
  }

  const { chartData, chartConfig } = buildChartData(categories, expenses);
  const { balance, expenseSum } = getBalance(chartData, userIncome);

  return (
    <div className="flex flex-col gap-4">
      <BalanceCard balance={balance} expenses={expenseSum} income={userIncome.income} />
      <CardContainer>
        <PieChart chartData={chartData} chartConfig={chartConfig} />
      </CardContainer>
    </div>
  );
}
