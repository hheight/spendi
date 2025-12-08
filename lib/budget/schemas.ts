import { BudgetType } from "@/app/generated/prisma";
import { z } from "zod";

export const budgetSchema = z
  .object({
    type: z.enum(BudgetType),
    amount: z.string().min(1, "Amount is required"),
    categoryId: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.type === BudgetType.CATEGORY && !data.categoryId) {
      ctx.addIssue({
        code: "custom",
        message: "Category is required for category budget",
        path: ["categoryId"]
      });
    }
  });

export type BudgetInput = z.infer<typeof budgetSchema>;
