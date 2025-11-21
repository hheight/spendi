import ExpenseForm from "@/components/expenses/form";
import { getCategories, getExpenseById } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/expenses/edit/[id]">) {
  const { id } = await props.params;
  const [foundExpense, categories] = await Promise.all([
    getExpenseById(id),
    getCategories()
  ]);

  if (!foundExpense) {
    notFound();
  }

  return <ExpenseForm categories={categories} expense={foundExpense} />;
}
