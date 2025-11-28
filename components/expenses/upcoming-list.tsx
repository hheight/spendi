import { Separator } from "@/components/ui/separator";
import type { ExpenseWithColor } from "@/types";
import ExpensesListItem from "./list-item";
import { format } from "date-fns";

type Props = {
  expenses: ExpenseWithColor[];
};

export default function UpcomingExpensesList({ expenses }: Props) {
  if (expenses.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground text-sm font-medium uppercase">Upcoming</p>
        <Separator />
      </div>
      <ul className="align-center text-muted-foreground flex flex-col gap-4 opacity-50">
        {expenses.map(expense => {
          const { id, item, value, createdAt, category } = expense;
          return (
            <ExpensesListItem
              key={id}
              id={id}
              title={item}
              amount={value}
              color={category.color}
              subtitle={format(createdAt, "d MMM")}
            />
          );
        })}
      </ul>
    </div>
  );
}
