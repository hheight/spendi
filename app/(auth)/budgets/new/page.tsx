import BudgetForm from "@/components/budgets/form";
import { getCategories } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function Page() {
  const categories = await getCategories();

  if (categories === null) {
    notFound();
  }

  return <BudgetForm categories={categories} />;
}
