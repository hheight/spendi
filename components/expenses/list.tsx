import type { ExpenseWithColor } from "@/types";
import ExpensesListItem from "./list-item";
import { format, isFuture } from "date-fns";

type Props = {
  expenses: ExpenseWithColor[];
};

function formatDateShort(date: Date | undefined) {
  if (!date) {
    return null;
  }

  return format(date, "E d MMM");
}

function setDateSeparator(
  currentCreatedAt: Date,
  prevCreatedAt: Date,
  isUpcoming: boolean
) {
  if (isUpcoming) {
    const prevIsUpcoming = isFuture(prevCreatedAt);
    return prevIsUpcoming ? null : "Upcoming";
  } else {
    const prevDate = formatDateShort(prevCreatedAt);
    const currentDate = formatDateShort(currentCreatedAt);
    return currentDate !== prevDate ? currentDate : null;
  }
}

export default function ExpensesList({ expenses }: Props) {
  return (
    <ul className="align-center flex flex-col gap-4">
      {expenses.map((expense, i) => {
        const { id, item, value, createdAt, category } = expense;
        const isUpcoming = isFuture(createdAt);

        return (
          <ExpensesListItem
            key={id}
            id={id}
            title={item}
            amount={value}
            color={category.color}
            dateSeparator={setDateSeparator(
              createdAt,
              expenses[i - 1]?.createdAt,
              isUpcoming
            )}
            className={isUpcoming ? "opacity-50" : undefined}
            subtitle={
              isUpcoming ? format(createdAt, "d MMM") : format(createdAt, "kk:mm")
            }
          />
        );
      })}
    </ul>
  );
}
