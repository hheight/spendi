import { getPaginatedExpenses } from "@/lib/dal";
import EmptyList from "@/components/empty-list";
import ExpensesList from "@/components/expenses/list";

export default async function ExpensesListWrapper({
  query,
  currentPage,
  pageSize
}: {
  query?: string;
  currentPage: number;
  pageSize: number;
}) {
  const expenses = await getPaginatedExpenses(currentPage, pageSize, query);

  if (expenses.length === 0) {
    return <EmptyList />;
  }

  return <ExpensesList expenses={expenses} />;
}
