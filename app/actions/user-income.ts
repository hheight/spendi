"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { type IncomeInput, incomeSchema } from "@/lib/income/schemas";
import type { ActionResponse } from "@/app/actions/types";

export async function updateUserIncome(data: IncomeInput): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = incomeSchema.safeParse(data);

  if (!session || !validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { income: parseFloat(data.income) }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "An error occured while saving income" };
  }
}
