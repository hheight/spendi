"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { type ExpenseInput, expenseSchema } from "@/lib/expense/schemas";
import type { ActionResponse, Expense } from "@/types";

export async function createExpense(data: ExpenseInput): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = expenseSchema.safeParse(data);

  if (!session || !validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    if (data.type === "existing") {
      const { description, amount, categoryId } = data;

      await prisma.expense.create({
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: categoryId
        }
      });
    }

    if (data.type === "new") {
      const { description, amount, categoryColor, categoryName } = data;

      const newCategory = await prisma.category.create({
        data: {
          name: categoryName,
          color: categoryColor,
          userId: session.userId
        }
      });

      await prisma.expense.create({
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: newCategory.id
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, message: "An error occured while creating expense" };
  }
}

export async function updateExpense(
  data: ExpenseInput,
  id: Expense["id"]
): Promise<ActionResponse> {
  const session = await verifySession();
  const validatedFields = expenseSchema.safeParse(data);

  if (!session || !validatedFields.success) {
    return {
      success: false
    };
  }

  try {
    if (data.type === "existing") {
      const { description, amount, categoryId } = data;

      await prisma.expense.update({
        where: { id },
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: categoryId
        }
      });
    }

    if (data.type === "new") {
      const { description, amount, categoryColor, categoryName } = data;

      const newCategory = await prisma.category.create({
        data: {
          name: categoryName,
          color: categoryColor,
          userId: session.userId
        }
      });

      await prisma.expense.update({
        where: { id },
        data: {
          item: description,
          value: Number(amount),
          userId: session.userId,
          categoryId: newCategory.id
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to edit expense:", error);
    return { success: false, message: "An error occured while editing expense" };
  }
}
