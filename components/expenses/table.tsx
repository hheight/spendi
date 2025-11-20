import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getTextColorClass } from "@/lib/utils";
import type { ExpenseWithCategory } from "@/types";

type Props = {
  expenses: ExpenseWithCategory[];
};

export default function ExpensesTable({ expenses }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map(expense => {
          return (
            <TableRow key={expense.id}>
              <TableCell>{expense.item}</TableCell>
              <TableCell>
                <Badge
                  style={{ backgroundColor: expense.category.color }}
                  className={getTextColorClass(expense.category.color)}
                >
                  {expense.category.name}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                €
                {expense.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
