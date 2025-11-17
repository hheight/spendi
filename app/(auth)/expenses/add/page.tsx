import ExpenseForm from "@/components/expense/form";
import { getCategories } from "@/lib/dal";

export default async function Page() {
  const categories = await getCategories();

  return <ExpenseForm categories={categories} />;
}
