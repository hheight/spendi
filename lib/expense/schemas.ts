import * as z from "zod";

const existingCategoryExpenseSchema = z.object({
  type: z.literal("existing"),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  date: z.date(),
  categoryId: z.string().min(1, { message: "Category is required" })
});

const newCategoryExpenseSchema = z.object({
  type: z.literal("new"),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  date: z.date(),
  categoryName: z.string().min(1, { message: "Name is required" }),
  categoryColor: z.string().min(1, { message: "Color is required" })
});

export const expenseSchema = z.discriminatedUnion("type", [
  existingCategoryExpenseSchema,
  newCategoryExpenseSchema
]);

export type ExpenseInput = z.infer<typeof expenseSchema>;
