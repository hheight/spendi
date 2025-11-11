import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Card, CardContent } from "@/components/ui/card";

import RoundedPieChart from "@/components/rounded-pie-chart";
import { getCategories, getExpensesByCategory } from "@/lib/dal";
import { buildChartData } from "@/lib/utils";
import { BanknoteX } from "lucide-react";

function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mx-auto flex w-full max-w-prose flex-col">
      <CardContent className="flex-1 pb-0">{children}</CardContent>
    </Card>
  );
}

export default async function Page() {
  const categories = await getCategories();
  const expenses = await getExpensesByCategory();

  if (!categories || !expenses) {
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

  return (
    <CardContainer>
      <RoundedPieChart chartData={chartData} chartConfig={chartConfig} />
    </CardContainer>
  );
}
