import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormattedAmount from "@/components/formatted-amount";
import { cn } from "@/lib/utils";

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
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-sm">
          <h3 className="group-hover:underline">{name}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
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
        <Progress color={color} className="mt-1 h-4" value={progressValue} />
      </CardContent>
    </Card>
  );
}
