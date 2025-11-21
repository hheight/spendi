import { Separator } from "@/components/ui/separator";
import type { ExpenseWithCategory } from "@/types";
import FormattedAmount from "@/components/formatted-amount";
import Link from "next/link";

type Props = {
  expenses: ExpenseWithCategory[];
};

function formatDateShort(date: Date | undefined) {
  if (!date) {
    return null;
  }

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

export default function ExpensesList({ expenses }: Props) {
  return (
    <ul className="align-center flex flex-col gap-4">
      {expenses.map((expense, i) => {
        const { id, item, value, createdAt, category } = expense;
        const nextDate = formatDateShort(expenses[i + 1]?.createdAt);
        const currentDate = formatDateShort(createdAt);

        return (
          <li key={id}>
            {currentDate !== nextDate && (
              <div className="mb-4">
                <p className="text-muted-foreground text-sm font-medium uppercase">
                  {currentDate}
                </p>
                <Separator />
              </div>
            )}
            <Link href={`/expenses/edit/${id}`} className="group block">
              <div key={id} className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: category.color }}
                  className="h-9 w-9 rounded-md"
                ></div>
                <div className="flex-1 leading-5">
                  <p className="group-hover:decoration-muted-foreground font-medium group-hover:underline">
                    {item}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    {createdAt.toLocaleTimeString("en-GB", {
                      hour: "numeric",
                      minute: "numeric"
                    })}
                  </span>
                </div>
                <FormattedAmount amount={value} />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
