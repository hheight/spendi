import * as z from "zod";

export const incomeSchema = z.object({
  income: z.string().min(1, { message: "Income is required" })
});

export type IncomeInput = z.infer<typeof incomeSchema>;
