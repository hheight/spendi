import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getCompletedExpenses, getUpcomingExpenses } from "@/lib/dal";
import Link from "next/link";
import CompletedExpensesList from "@/components/expenses/completed-list";
import UpcomingExpensesList from "@/components/expenses/upcoming-list";
import PaginationControls from "@/components/pagination-controls";
import { notFound } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import EmptyList from "@/components/empty-list";

export const metadata: Metadata = {
  title: "Expenses"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  if (isNaN(page) || page < 1) {
    notFound();
  }
  const [completedExpensesData, upcomingExpenses] = await Promise.all([
    getCompletedExpenses(page),
    getUpcomingExpenses()
  ]);

  const { expenses, totalPages, currentPage, hasNextPage, hasPreviousPage } =
    completedExpensesData;

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Expenses</h1>
        </CardTitle>
        <CardAction>
          <Button variant="outline" asChild>
            <Link href="/expenses/new">
              Add expense <Plus />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-8">
        {expenses.length === 0 && upcomingExpenses.length === 0 ? (
          <EmptyList />
        ) : (
          <>
            {currentPage === 1 && <UpcomingExpensesList expenses={upcomingExpenses} />}
            <CompletedExpensesList expenses={expenses} />
          </>
        )}
      </CardContent>
      <CardFooter>
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        )}
      </CardFooter>
    </Card>
  );
}
