import BudgetsList from "@/components/budgets/list";
import EmptyList from "@/components/empty-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getBudgets, getExpensesByCategory } from "@/lib/dal";
import { getCurrentMonthRange } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Budgets</h1>
        </CardTitle>
        <CardAction>
          <Button variant="outline" asChild>
            <Link href="/budgets/new">
              Add budget <Plus />
            </Link>
          </Button>
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
  );
}
