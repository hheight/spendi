import { Progress } from "@/components/ui/progress";
import FormattedAmount from "@/components/formatted-amount";
import { cn } from "@/lib/utils";

type Props = {
  budgetValue: number;
  spent: number;
};

export default function OverallBudget({ budgetValue, spent }: Props) {
  const amountLeft = budgetValue - spent;
  const spentPercentage = (spent * 100) / budgetValue;
  const progressValue = 100 - spentPercentage;
  const isOverSpent = progressValue < 0;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-muted-foreground text-sm font-medium uppercase">
        Overall spent: {spentPercentage.toFixed()}%
      </p>
      <Progress className="h-5" value={progressValue} />
      <div className="flex flex-col items-center">
        <FormattedAmount
          className={cn("block text-xl before:text-base", isOverSpent && "text-red-400")}
          amount={amountLeft}
        />
        <p className="text-muted-foreground text-sm font-medium">
          {isOverSpent ? "over" : "left"} this month
        </p>
      </div>
    </div>
  );
}
