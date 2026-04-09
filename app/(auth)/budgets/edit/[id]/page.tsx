import BudgetForm from "@/components/budgets/form";
import { getCategories, getBudgetById } from "@/lib/dal";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit budget"
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  const { id } = await params;
  const [budget, categories] = await Promise.all([getBudgetById(id), getCategories()]);

  if (!budget) {
    notFound();
  }

  return <BudgetForm categories={categories} budget={budget} />;
}
