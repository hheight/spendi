"use server";

import prisma from "@/lib/prisma";
import { budgetSchema, type BudgetInput } from "@/lib/budget/schemas";
import { verifySession } from "@/lib/auth/session";
import type { ActionResponse, Budget } from "@/types";
import { BudgetType } from "@/app/generated/prisma";
import { getUserMessage, logPrismaError } from "@/lib/prisma-error";

export async function createBudget(data: BudgetInput): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = budgetSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    const { amount, categoryId, type } = data;

    if (type === BudgetType.OVERALL) {
      const existingOverallBudget = await prisma.budget.findFirst({
        where: {
          userId: session.userId,
          type: BudgetType.OVERALL,
          categoryId: null
        }
      });

      if (existingOverallBudget) {
        return {
          success: false,
          message: "You already have an overall budget"
        };
      }
    }

    if (type === BudgetType.CATEGORY && categoryId) {
      const existingCategoryBudget = await prisma.budget.findFirst({
        where: {
          userId: session.userId,
          type: BudgetType.CATEGORY,
          categoryId
        }
      });

      if (existingCategoryBudget) {
        return {
          success: false,
          message: "Budget for this category already exists"
        };
      }
    }

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
    logPrismaError(error, "createBudget");
    return { success: false, message: getUserMessage(error) };
  }
}

export async function updateBudget(
  data: BudgetInput,
  id: Budget["id"]
): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = budgetSchema.safeParse(data);

  if (!validatedFields.success) {
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
    logPrismaError(error, "updateBudget");
    return { success: false, message: getUserMessage(error) };
  }
}

export async function deleteBudget(id: Budget["id"]): Promise<ActionResponse> {
  const session = await verifySession();

  try {
    await prisma.budget.delete({
      where: { id, userId: session.userId }
    });

    return { success: true };
  } catch (error) {
    logPrismaError(error, "deleteBudget");
    return { success: false, message: getUserMessage(error) };
  }
}
