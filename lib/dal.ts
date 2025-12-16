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

export async function getCategories(): Promise<CategoryPreview[]> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getExpensesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ExpenseByDateRange[]> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getExpensesByCategory(
  startDate: Date,
  endDate: Date
): Promise<ExpenseByCategory[]> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getPaginatedExpenses(
  page: number = 1,
  pageSize: number = 15
): Promise<{
  expenses: ExpenseWithColor[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> {
  const session = await verifySession();

  try {
    const validPage = Math.max(1, page);
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
    throw error;
  }
}

export async function getUpcomingExpenses(): Promise<ExpenseWithColor[]> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getExpenseById(id: Expense["id"]): Promise<Expense | null> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getFirstExpense(): Promise<Expense | null> {
  const session = await verifySession();

  try {
    const data = await prisma.expense.findFirst({
      where: { userId: session.userId },
      orderBy: {
        createdAt: "asc"
      }
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getBudgets(): Promise<Budget[]> {
  const session = await verifySession();

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
    throw error;
  }
}

export async function getBudgetById(id: Budget["id"]): Promise<Budget | null> {
  const session = await verifySession();

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
    throw error;
  }
}
