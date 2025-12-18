import AddButton from "@/components/add-button";
import { BudgetsContainer } from "@/components/budgets/container";
import PageTitle from "@/components/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets"
};

export default async function BudgetsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle text="Budgets" />
        <AddButton text="Add budget" href="/budgets/new" />
      </div>
      <BudgetsContainer />
    </>
  );
}
