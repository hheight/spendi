import ExpenseForm from "@/components/expenses/form";
import { getCategories } from "@/lib/dal";
import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add expense"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  const categories = await getCategories();
  const { redirectTo } = await searchParams;

  return <ExpenseForm categories={categories} redirectTo={redirectTo} />;
}
