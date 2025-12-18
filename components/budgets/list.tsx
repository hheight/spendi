"use client";

import CategoryBudget from "@/components/budgets/category-budget";
import OverallBudget from "@/components/budgets/overall-budget";
import { BudgetType } from "@/app/generated/prisma";
import Link from "next/link";
import type { Budget, ExpenseByCategory } from "@/types";

type Props = {
  budgets: Budget[];
  expenses: ExpenseByCategory[];
};

export default function BudgetsList({ budgets, expenses }: Props) {
  return (
    <ul className="space-y-4">
      {budgets.map(budget => {
        const categoryId = budget.category?.id;
        let overallSpent: number;

        if (categoryId) {
          const foundExpense = expenses.find(e => e.categoryId === categoryId);
          overallSpent = foundExpense?._sum?.value || 0;
        } else {
          overallSpent = expenses.reduce((acc, currentExpense) => {
            if (currentExpense._sum?.value) {
              acc += currentExpense._sum.value;
            }
            return acc;
          }, 0);
        }

        return (
          <li key={budget.id}>
            <Link prefetch={false} className="group" href={`/budgets/edit/${budget.id}`}>
              {budget.type === BudgetType.OVERALL ? (
                <OverallBudget budgetValue={budget.value} spent={overallSpent} />
              ) : (
                <CategoryBudget
                  budgetValue={budget.value}
                  spent={overallSpent}
                  name={budget.category?.name || ""}
                  color={budget.category?.color}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
