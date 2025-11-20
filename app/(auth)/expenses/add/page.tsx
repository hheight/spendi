import ExpenseForm from "@/components/expenses/form";
import { getCategories } from "@/lib/dal";

export default async function Page() {
  const categories = await getCategories();

  return <ExpenseForm categories={categories} />;
}
