import { Button } from "@/components/ui/button";
import { getExpenses } from "@/lib/dal";
import Link from "next/link";
import ExpensesTable from "@/components/expense/table";
import EmptyList from "@/components/empty-list";
import ContentWrapper from "@/components/expense/content-wrapper";

export default async function Page() {
  const expenses = await getExpenses();

  if (!expenses) {
    return null;
  }

  if (expenses.length === 0) {
    return (
      <ContentWrapper>
        <EmptyList />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper className="gap-8">
      <ExpensesTable expenses={expenses} />
      <Button variant="outline" asChild>
        <Link href="/expenses/add">Add new expense</Link>
      </Button>
    </ContentWrapper>
  );
}
