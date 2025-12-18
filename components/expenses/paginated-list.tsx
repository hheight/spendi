import { notFound } from "next/navigation";
import { getPaginatedExpenses } from "@/lib/dal";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import EmptyList from "@/components/empty-list";
import ExpensesList from "@/components/expenses/list";
import PaginationControls from "@/components/pagination-controls";
import SearchBar from "@/components/expenses/search-bar";

export default async function PaginatedExpensesList({
  query,
  page
}: {
  query: string;
  page: number;
}) {
  const expensesData = await getPaginatedExpenses(page, 15, query);

  const { expenses, totalPages, currentPage, hasNextPage, hasPreviousPage } =
    expensesData;

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <SearchBar />
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
  );
}
