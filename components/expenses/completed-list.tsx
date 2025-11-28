import type { ExpenseWithColor } from "@/types";
import EmptyList from "../empty-list";
import ExpensesListItem from "./list-item";
import { format } from "date-fns";

type Props = {
  expenses: ExpenseWithColor[];
};

function formatDateShort(date: Date | undefined) {
  if (!date) {
    return null;
  }

  return format(date, "E d MMM");
}

export default function CompletedExpensesList({ expenses }: Props) {
  if (expenses.length === 0) {
    return <EmptyList />;
  }

  return (
    <ul className="align-center flex flex-col gap-4">
      {expenses.map((expense, i) => {
        const { id, item, value, createdAt, category } = expense;
        const prevDate = formatDateShort(expenses[i - 1]?.createdAt);
        const currentDate = formatDateShort(createdAt);

        return (
          <ExpensesListItem
            key={id}
            id={id}
            title={item}
            amount={value}
            color={category.color}
            dateSeparator={currentDate !== prevDate ? currentDate : null}
            subtitle={format(createdAt, "kk:mm")}
          />
        );
      })}
    </ul>
  );
}
