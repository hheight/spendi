"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth/session";
import { type ExpenseInput, expenseSchema } from "@/lib/expense/schemas";
import type { ActionResponse, Expense } from "@/types";
import { getUserMessage, logPrismaError } from "@/lib/prisma-error";

export async function createExpense(data: ExpenseInput): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = expenseSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    if (data.type === "existing") {
      const { description, amount, categoryId, date } = data;

      await prisma.expense.create({
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: categoryId,
          createdAt: date
        }
      });
    }

    if (data.type === "new") {
      const { description, amount, categoryColor, categoryName, date } = data;

      await prisma.$transaction(async tx => {
        const newCategory = await tx.category.create({
          data: {
            name: categoryName,
            color: categoryColor,
            userId: session.userId
          }
        });

        await tx.expense.create({
          data: {
            item: description,
            value: Number(amount),
            userId: session.userId,
            categoryId: newCategory.id,
            createdAt: date
          }
        });
      });
    }

    return { success: true };
  } catch (error) {
    logPrismaError(error, "createExpense");
    return { success: false, message: getUserMessage(error) };
  }
}

export async function updateExpense(
  data: ExpenseInput,
  id: Expense["id"]
): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = expenseSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    if (data.type === "existing") {
      const { description, amount, categoryId, date } = data;

      await prisma.expense.update({
        where: { id },
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: categoryId,
          createdAt: date
        }
      });
    }

    if (data.type === "new") {
      const { description, amount, categoryColor, categoryName, date } = data;

      await prisma.$transaction(async tx => {
        const newCategory = await tx.category.create({
          data: {
            name: categoryName,
            color: categoryColor,
            userId: session.userId
          }
        });

        await tx.expense.update({
          where: { id },
          data: {
            item: description,
            value: Number(amount),
            userId: session.userId,
            categoryId: newCategory.id,
            createdAt: date
          }
        });
      });
    }

    return { success: true };
  } catch (error) {
    logPrismaError(error, "updateExpense");
    return { success: false, message: getUserMessage(error) };
  }
}

export async function deleteExpense(id: Expense["id"]): Promise<ActionResponse> {
  const session = await verifySession();

  try {
    await prisma.expense.delete({
      where: { id, userId: session.userId }
    });

    return { success: true };
  } catch (error) {
    logPrismaError(error, "deleteExpense");
    return { success: false, message: getUserMessage(error) };
  }
}
