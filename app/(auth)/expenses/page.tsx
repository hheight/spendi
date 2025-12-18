import type { Metadata } from "next";
import PageTitle from "@/components/page-title";
import AddButton from "@/components/add-button";
import ExpensesListWrapper from "@/components/expenses/list-wrapper";
import { Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SearchBar from "@/components/expenses/search-bar";
import { getExpensesPages } from "@/lib/dal";
import PaginationControls from "@/components/pagination-controls";
import ExpensesSkeleton from "@/components/skeletons/expenses";

const PAGE_SIZE = 15;

export const metadata: Metadata = {
  title: "Expenses"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.query || "";

  const totalPages = await getExpensesPages(query, PAGE_SIZE);

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle text="Expenses" />
        <AddButton text="Add expense" href="/expenses/new" />
      </div>
      <Card>
        <CardHeader>
          <SearchBar />
        </CardHeader>
        <CardContent className="space-y-8">
          <Suspense key={query + page} fallback={<ExpensesSkeleton />}>
            <ExpensesListWrapper query={query} currentPage={page} pageSize={PAGE_SIZE} />
          </Suspense>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <PaginationControls totalPages={totalPages} />
          </CardFooter>
        )}
      </Card>
    </>
  );
}
