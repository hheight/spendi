import "server-only";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cache } from "react";
import type {
  CategoryPreview,
  ExpenseByCategory,
  ExpenseWithCategory,
  UserIncome,
  Expense
} from "@/types";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getCategories = cache(async (): Promise<CategoryPreview[] | null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.category.findMany({
      where: { userId: session.userId },
      select: {
        id: true,
        name: true,
        color: true
      },
      orderBy: { name: "asc" }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }
});

export const getExpenses = cache(async (): Promise<ExpenseWithCategory[] | null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.expense.findMany({
      where: { userId: session.userId },
      select: {
        id: true,
        item: true,
        value: true,
        category: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return null;
  }
});

export const getExpensesByCategory = cache(
  async (): Promise<ExpenseByCategory[] | null> => {
    const session = await verifySession();
    if (!session) return null;

    try {
      const data = await prisma.expense.groupBy({
        by: ["categoryId"],
        where: { userId: session.userId },
        _sum: { value: true }
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch expenses by category:", error);
      return null;
    }
  }
);

export const getExpenseById = cache(
  async (id: Expense["id"]): Promise<Expense | null> => {
    const session = await verifySession();
    if (!session) return null;

    try {
      const data = await prisma.expense.findUnique({
        where: { userId: session.userId, id },
        select: {
          id: true,
          item: true,
          value: true,
          categoryId: true
        }
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch expense by id:", error);
      return null;
    }
  }
);

export const getUserIncome = cache(async (): Promise<UserIncome | null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        income: true
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});
