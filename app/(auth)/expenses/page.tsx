import { Button } from "@/components/ui/button";
import { getExpenses } from "@/lib/dal";
import Link from "next/link";
import ExpensesList from "@/components/expenses/list";
import ContentWrapper from "@/components/expenses/content-wrapper";

export default async function Page() {
  const expenses = await getExpenses();

  if (!expenses) {
    return null;
  }

  return (
    <ContentWrapper className="gap-8">
      <ExpensesList expenses={expenses} />
      <Button variant="outline" asChild>
        <Link href="/expenses/new">Add new expense</Link>
      </Button>
    </ContentWrapper>
  );
}
