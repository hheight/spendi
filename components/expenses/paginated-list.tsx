import { notFound } from "next/navigation";
import { getPaginatedExpenses } from "@/lib/dal";
import EmptyList from "@/components/empty-list";
import ExpensesList from "@/components/expenses/list";
import PaginationControls from "@/components/pagination-controls";

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

  if (expenses.length === 0) {
    return <EmptyList />;
  }

  return (
    <>
      <ExpensesList expenses={expenses} />
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </>
  );
}
