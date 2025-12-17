import AddButton from "@/components/add-button";
import BudgetsList from "@/components/budgets/list";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { getBudgets, getExpensesByCategory } from "@/lib/dal";
import { getCurrentMonthRange } from "@/lib/utils";
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
      <div className="flex items-center justify-between">
        <PageTitle text="Budgets" />
        <AddButton text="Add budget" href="/budgets/new" />
      </div>
      {budgets.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyList />
          </CardContent>
        </Card>
      ) : (
        <BudgetsList budgets={budgets} expenses={expenses} />
      )}
    </>
  );
}
