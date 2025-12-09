import BudgetForm from "@/components/budgets/form";
import { getCategories } from "@/lib/dal";

export default async function Page() {
  const categories = await getCategories();

  return <BudgetForm categories={categories} />;
}
