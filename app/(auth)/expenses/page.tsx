import { Button } from "@/components/ui/button";
import { getCompletedExpenses, getUpcomingExpenses } from "@/lib/dal";
import Link from "next/link";
import CompletedExpensesList from "@/components/expenses/completed-list";
import UpcomingExpensesList from "@/components/expenses/upcoming-list";
import PaginationControls from "@/components/pagination-controls";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus } from "lucide-react";

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
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-lg">
          <h1>Expenses</h1>
        </CardTitle>
        <Button variant="outline" asChild>
          <Link href="/expenses/new">
            Add expense <Plus />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {currentPage === 1 && (
          <div className="mb-8">
            <UpcomingExpensesList expenses={upcomingExpenses} />
          </div>
        )}
        <CompletedExpensesList expenses={expenses} />
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
