import type { ExpenseByDateRange } from "@/types";
import { getDate } from "date-fns";

export function filterExpensesByDay(expenses: ExpenseByDateRange[], day: number) {
  return expenses.filter(expense => getDate(expense.createdAt) === day);
}
