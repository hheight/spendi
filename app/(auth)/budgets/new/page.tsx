import BudgetForm from "@/components/budgets/form";
import { getCategories } from "@/lib/dal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add budget"
};

export default async function Page() {
  const categories = await getCategories();

  return <BudgetForm categories={categories} />;
}
