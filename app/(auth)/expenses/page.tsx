import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import AddButton from "@/components/add-button";
import PaginatedExpensesList from "@/components/expenses/paginated-list";

export const metadata: Metadata = {
  title: "Expenses"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const query = params.query;

  if (isNaN(page) || page < 1) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle text="Expenses" />
        <AddButton text="Add expense" href="/expenses/new" />
      </div>
      <PaginatedExpensesList query={query} page={page} />
    </>
  );
}
