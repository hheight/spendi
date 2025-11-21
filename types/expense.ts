import type { Prisma } from "@/app/generated/prisma";

export type ExpenseByCategory = Pick<
  Prisma.ExpenseGroupByOutputType,
  "categoryId" | "_sum"
>;

export type ExpenseWithCategory = Prisma.ExpenseGetPayload<{
  select: { id: true; item: true; value: true; category: true; createdAt: true };
}>;

export type Expense = Prisma.ExpenseGetPayload<{
  select: { id: true; item: true; value: true; categoryId: true };
}>;
