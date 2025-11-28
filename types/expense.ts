import type { Prisma } from "@/app/generated/prisma";

export type ExpenseWithColor = Prisma.ExpenseGetPayload<{
  select: {
    id: true;
    item: true;
    value: true;
    category: {
      select: {
        color: true;
      };
    };
    createdAt: true;
  };
}>;

export type Expense = Prisma.ExpenseGetPayload<{
  select: { id: true; item: true; value: true; categoryId: true; createdAt: true };
}>;

export type ExpenseByDateRange = Prisma.ExpenseGetPayload<{
  select: {
    id: true;
    item: true;
    value: true;
    createdAt: true;
    category: {
      select: {
        name: true;
        color: true;
      };
    };
  };
}>;

export type ExpensesChartItem = {
  day: number;
  [key: string]: number;
};
