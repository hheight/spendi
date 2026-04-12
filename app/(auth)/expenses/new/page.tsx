import ExpenseForm from "@/components/expenses/form";
import { getCategories } from "@/lib/dal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add expense"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const categories = await getCategories();
  const { redirectTo } = await searchParams;

  return <ExpenseForm categories={categories} redirectTo={redirectTo} />;
}
