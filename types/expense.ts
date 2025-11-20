import type { Prisma } from "@/app/generated/prisma";
import type { ExpenseInput } from "@/lib/expense/schemas";
import type { CategoryPreview } from "@/types";
import type { Control } from "react-hook-form";

export type ExpenseByCategory = Pick<
  Prisma.ExpenseGroupByOutputType,
  "categoryId" | "_sum"
>;

export type ExpenseWithCategory = Prisma.ExpenseGetPayload<{
  select: { id: true; item: true; value: true; category: true };
}>;

export type FormControlProps = {
  formControl: Control<ExpenseInput>;
};

export type CategoryFormGroupProps = FormControlProps & {
  categories: CategoryPreview[] | null;
};
