import type { Metadata } from "next";
import { getPaginatedExpenses, getUpcomingExpenses } from "@/lib/dal";
import CompletedExpensesList from "@/components/expenses/completed-list";
import UpcomingExpensesList from "@/components/expenses/upcoming-list";
import PaginationControls from "@/components/pagination-controls";
import { notFound } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";
import AddButton from "@/components/add-button";

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
  const [paginatedExpensesData, upcomingExpenses] = await Promise.all([
    getPaginatedExpenses(page),
    getUpcomingExpenses()
  ]);

  const { expenses, totalPages, currentPage, hasNextPage, hasPreviousPage } =
    paginatedExpensesData;

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  return (
    <>
      <PageTitle text="Expenses" icon={CreditCard} />
      <Card>
        <CardHeader>
          <CardAction>
            <AddButton text="Add expense" href="/expenses/new" />
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
    </>
  );
}
