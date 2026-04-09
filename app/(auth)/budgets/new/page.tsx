import BudgetForm from "@/components/budgets/form";
import { getCategories } from "@/lib/dal";
import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add budget"
};

export default async function Page() {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  const categories = await getCategories();

  return <BudgetForm categories={categories} />;
}
