import FormattedAmount from "@/components/formatted-amount";
import { format } from "date-fns";
import MonthSelect from "@/components/dashboard/month-select";

type Props = {
  totalSpent: number;
  amountSpent: number;
  highlightedDate: Date | null;
  monthSelectOptions: { value: string; label: string }[];
};

export default async function ChartHeader({
  totalSpent,
  amountSpent,
  highlightedDate,
  monthSelectOptions
}: Props) {
  return (
    <>
      <div>
        <MonthSelect options={monthSelectOptions} />
        <FormattedAmount
          className="text-xl before:text-base"
          amount={totalSpent}
          negativeValue
        />
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium uppercase">
          {highlightedDate === null ? "Spent/day" : format(highlightedDate, "d MMM yyyy")}
        </p>
        <FormattedAmount className="text-xl before:text-base" amount={amountSpent} />
      </div>
    </>
  );
}
