import "server-only";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cache } from "react";
import type {
  CategoryPreview,
  ExpenseWithColor,
  Expense,
  ExpenseByDateRange,
  Budget,
  ExpenseByCategory
} from "@/types";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export async function getCategories(): Promise<CategoryPreview[] | null> {
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
}

export async function getExpensesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ExpenseByDateRange[] | null> {
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

export async function getExpensesByCategory(
  startDate: Date,
  endDate: Date
): Promise<ExpenseByCategory[] | null> {
  const session = await verifySession();
  if (!session) return null;

  try {
    const result = await prisma.expense.groupBy({
      by: ["categoryId"],
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

    return result;
  } catch (error) {
    console.error("Failed to fetch expenses by category:", error);
    return null;
  }
}

export async function getCompletedExpenses(
  page: number = 1,
  pageSize: number = 15
): Promise<{
  expenses: ExpenseWithColor[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} | null> {
  const session = await verifySession();
  if (!session) return null;

  const validPage = Math.max(1, page);

  try {
    const skip = (validPage - 1) * pageSize;

    const [data, totalCount] = await Promise.all([
      prisma.expense.findMany({
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
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize
      }),
      prisma.expense.count({
        where: { userId: session.userId, createdAt: { lte: new Date() } }
      })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      expenses: data,
      totalPages,
      currentPage: validPage,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1
    };
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return null;
  }
}

export async function getUpcomingExpenses(): Promise<ExpenseWithColor[] | null> {
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
}

export async function getExpenseById(id: Expense["id"]): Promise<Expense | null> {
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

export async function getFirstExpense(): Promise<Expense | null> {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.expense.findFirst({
      where: { userId: session.userId },
      orderBy: {
        createdAt: "asc"
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch first expense:", error);
    return null;
  }
}

export async function getBudgets(): Promise<Budget[] | null> {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.budget.findMany({
      where: {
        userId: session.userId
      },
      select: {
        id: true,
        type: true,
        value: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        type: "asc"
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return null;
  }
}

export async function getBudgetById(id: Budget["id"]): Promise<Budget | null> {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.budget.findUnique({
      where: {
        userId: session.userId,
        id
      },
      select: {
        id: true,
        type: true,
        value: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch budget:", error);
    return null;
  }
}
