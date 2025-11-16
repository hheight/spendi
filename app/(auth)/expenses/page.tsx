import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getExpenses } from "@/lib/dal";
import { getTextColorClass } from "@/lib/utils";

export default async function Page() {
  const expenses = await getExpenses();

  return (
    <div className="bg-background text-card-foreground mx-auto flex w-full flex-col gap-1 rounded-xl border px-4 py-6 shadow-sm">
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.map(expense => {
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
    </div>
  );
}
