import ExpenseForm from "@/components/expenses/form";
import { getCategories, getExpenseById } from "@/lib/dal";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit expense"
};

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { id } = await params;
  const { redirectTo } = await searchParams;
  const [foundExpense, categories] = await Promise.all([
    getExpenseById(id),
    getCategories()
  ]);

  if (!foundExpense) {
    notFound();
  }

  return (
    <ExpenseForm categories={categories} expense={foundExpense} redirectTo={redirectTo} />
  );
}
