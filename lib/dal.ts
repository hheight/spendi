import "server-only";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cache } from "react";
import type {
  CategoryPreview,
  ExpenseWithColor,
  UserIncome,
  Expense,
  ExpenseByDateRange
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

export const getExpensesByDateRange = cache(
  async (startDate: Date, endDate: Date): Promise<ExpenseByDateRange[] | null> => {
    const session = await verifySession();
    if (!session) return null;

    try {
      const data = await prisma.expense.findMany({
        where: {
          userId: session.userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          item: true,
          value: true,
          createdAt: true,
          category: {
            select: {
              name: true,
              color: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      return null;
    }
  }
);

export const getCompletedExpenses = cache(
  async (): Promise<ExpenseWithColor[] | null> => {
    const session = await verifySession();
    if (!session) return null;

    try {
      const data = await prisma.expense.findMany({
        where: { userId: session.userId, createdAt: { lte: new Date() } },
        select: {
          id: true,
          item: true,
          value: true,
          category: {
            select: {
              color: true
            }
          },
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      return null;
    }
  }
);

export const getUpcomingExpenses = cache(async (): Promise<ExpenseWithColor[] | null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.expense.findMany({
      where: { userId: session.userId, createdAt: { gt: new Date() } },
      select: {
        id: true,
        item: true,
        value: true,
        category: {
          select: {
            color: true
          }
        },
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

export const getExpensesTotalByDateRange = cache(
  async (startDate: Date, endDate: Date): Promise<number | null> => {
    const session = await verifySession();
    if (!session) return null;

    try {
      const data = await prisma.expense.aggregate({
        where: {
          userId: session.userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          value: true
        }
      });

      return data._sum.value;
    } catch (error) {
      console.error("Failed to fetch expenses total value:", error);
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
          categoryId: true,
          createdAt: true
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
