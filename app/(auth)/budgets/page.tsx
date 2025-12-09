import BudgetsList from "@/components/budgets/list";
import EmptyList from "@/components/empty-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgets, getExpensesByCategory } from "@/lib/dal";
import { getCurrentMonthRange } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function BudgetsPage() {
  const currentDate = new Date();
  const monthRange = getCurrentMonthRange(currentDate);

  const [budgets, expenses] = await Promise.all([
    getBudgets(),
    getExpensesByCategory(monthRange.start, monthRange.end)
  ]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-lg">
          <h1>Budgets</h1>
        </CardTitle>
        <Button variant="outline" asChild>
          <Link href="/budgets/new">
            Add budget <Plus />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <EmptyList />
        ) : (
          <BudgetsList budgets={budgets} expenses={expenses} />
        )}
      </CardContent>
    </Card>
  );
}
