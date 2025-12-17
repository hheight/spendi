import type { Metadata } from "next";
import { getPaginatedExpenses } from "@/lib/dal";
import ExpensesList from "@/components/expenses/list";
import PaginationControls from "@/components/pagination-controls";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import EmptyList from "@/components/empty-list";
import PageTitle from "@/components/page-title";
import AddButton from "@/components/add-button";
import SearchInput from "@/components/expenses/search-input";

export const metadata: Metadata = {
  title: "Expenses"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page: string; startsWith: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const startsWith = params.startsWith;

  if (isNaN(page) || page < 1) {
    notFound();
  }
  const paginatedExpensesData = await getPaginatedExpenses(page, 15, startsWith);

  const { expenses, totalPages, currentPage, hasNextPage, hasPreviousPage } =
    paginatedExpensesData;

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle text="Expenses" />
        <AddButton text="Add expense" href="/expenses/new" />
      </div>
      <Card>
        <CardHeader>
          <SearchInput />
        </CardHeader>
        <CardContent className="space-y-8">
          {expenses.length === 0 ? <EmptyList /> : <ExpensesList expenses={expenses} />}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </CardFooter>
        )}
      </Card>
    </>
  );
}
