"use server";

import prisma from "@/lib/prisma";
import { budgetSchema, type BudgetInput } from "@/lib/budget/schemas";
import { verifySession } from "@/lib/dal";
import type { ActionResponse, Budget } from "@/types";
import { BudgetType } from "@/app/generated/prisma";

export async function createBudget(data: BudgetInput): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = budgetSchema.safeParse(data);

  if (!session || !validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    const { amount, categoryId, type } = data;

    await prisma.budget.create({
      data: {
        type,
        value: Number(amount),
        userId: session.userId,
        categoryId: type === BudgetType.CATEGORY ? categoryId : null
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create budget:", error);
    return { success: false, message: "An error occured while creating budget" };
  }
}

export async function updateBudget(
  data: BudgetInput,
  id: Budget["id"]
): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = budgetSchema.safeParse(data);

  if (!session || !validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    const { amount } = data;

    await prisma.budget.update({
      where: { id },
      data: {
        value: Number(amount),
        userId: session.userId
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update budget:", error);
    return { success: false, message: "An error occured while updating budget" };
  }
}

export async function deleteBudget(id: Budget["id"]): Promise<ActionResponse> {
  const session = await verifySession();

  if (!session) {
    return {
      success: false
    };
  }

  try {
    await prisma.budget.delete({
      where: { id, userId: session.userId }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return { success: false, message: "An error occured while deleting budget" };
  }
}
