import BudgetsList from "@/components/budgets/list";
import EmptyList from "@/components/empty-list";
import { Card, CardContent } from "@/components/ui/card";
import { getBudgets, getExpensesByCategory } from "@/lib/dal";
import { getCurrentMonthRange } from "@/lib/utils";

export async function BudgetsContainer() {
  const currentDate = new Date();
  const monthRange = getCurrentMonthRange(currentDate);

  const [budgets, expenses] = await Promise.all([
    getBudgets(),
    getExpensesByCategory(monthRange.start, monthRange.end)
  ]);

  return (
    <>
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
