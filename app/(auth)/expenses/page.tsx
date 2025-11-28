import { Button } from "@/components/ui/button";
import { getCompletedExpenses, getUpcomingExpenses } from "@/lib/dal";
import Link from "next/link";
import CompletedExpensesList from "@/components/expenses/completed-list";
import ContentWrapper from "@/components/expenses/content-wrapper";
import UpcomingExpensesList from "@/components/expenses/upcoming-list";

export default async function Page() {
  const [completedExpenses, upcomingExpenses] = await Promise.all([
    getCompletedExpenses(),
    getUpcomingExpenses()
  ]);

  if (!completedExpenses) {
    return null;
  }

  return (
    <ContentWrapper className="gap-8">
      {upcomingExpenses && <UpcomingExpensesList expenses={upcomingExpenses} />}
      <CompletedExpensesList expenses={completedExpenses} />
      <Button variant="outline" asChild>
        <Link href="/expenses/new">Add new expense</Link>
      </Button>
    </ContentWrapper>
  );
}
