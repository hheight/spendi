import IncomeForm from "@/components/income-form";
import { getUserIncome } from "@/lib/dal";

export default async function Page() {
  const data = await getUserIncome();

  return <IncomeForm defaultValue={data?.income.toString() || "0"} />;
}
