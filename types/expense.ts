import type { Prisma } from "@/app/generated/prisma";

export type ExpenseByCategory = Pick<
  Prisma.ExpenseGroupByOutputType,
  "categoryId" | "_sum"
>;
