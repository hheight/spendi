import { Progress } from "@/components/ui/progress";
import FormattedAmount from "@/components/formatted-amount";
import { cn } from "@/lib/utils";
import CardWrapper from "./card-wrapper";

type Props = {
  name: string;
  budgetValue: number;
  spent: number;
  color?: string;
};

export default function CategoryBudget({ name, budgetValue, spent, color }: Props) {
  const amountLeft = budgetValue - spent;
  const spentPercentage = (spent * 100) / budgetValue;
  const progressValue = 100 - spentPercentage;
  const isOverSpent = progressValue < 0;

  return (
    <CardWrapper title={name}>
      <div className="space-y-1">
        {!isOverSpent && (
          <p className="text-xs font-medium uppercase text-green-600">
            {spentPercentage.toFixed()}% spent
          </p>
        )}
        <div>
          <FormattedAmount
            className={cn(
              "block text-base before:text-sm",
              isOverSpent && "text-red-400"
            )}
            amount={amountLeft}
          />
          <p className="text-muted-foreground text-xs font-medium">
            {isOverSpent ? "over" : "left"} this month
          </p>
        </div>
        <Progress color={color} className="mt-2 h-4" value={progressValue} />
      </div>
    </CardWrapper>
  );
}
