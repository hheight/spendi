import AddButton from "@/components/add-button";
import BudgetsList from "@/components/budgets/list";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { getBudgets, getExpensesByCategory } from "@/lib/dal";
import { getCurrentMonthRange } from "@/lib/utils";
import { HandCoins } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets"
};

export default async function BudgetsPage() {
  const currentDate = new Date();
  const monthRange = getCurrentMonthRange(currentDate);

  const [budgets, expenses] = await Promise.all([
    getBudgets(),
    getExpensesByCategory(monthRange.start, monthRange.end)
  ]);

  return (
    <>
      <PageTitle text="Budgets" icon={HandCoins} />
      <Card>
        <CardHeader>
          <CardAction>
            <AddButton text="Add budget" href="/budgets/new" />
          </CardAction>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <EmptyList />
          ) : (
            <BudgetsList budgets={budgets} expenses={expenses} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
