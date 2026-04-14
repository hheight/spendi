import "server-only";

import prisma from "@/lib/prisma";
import type { User } from "@/app/generated/prisma";
import { verifySession } from "@/lib/auth/session";
import type {
  CategoryPreview,
  ExpenseWithColor,
  Expense,
  ExpenseByDateRange,
  Budget,
  ExpenseByCategory
} from "@/types";

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
    console.error(error);
    throw new Error("Can't get categories");
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
    console.error(error);
    throw new Error("Can't get expenses");
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

export async function getExpensesPages(query: string, pageSize: number): Promise<number> {
  const session = await verifySession();

  try {
    const data = await prisma.expense.count({
      where: {
        userId: session.userId,
        item: { startsWith: query, mode: "insensitive" }
      }
    });

    return Math.ceil(data / pageSize);
  } catch (error) {
    console.error(error);
    throw new Error("Can't get expenses pages");
  }
}
export async function getPaginatedExpenses(
  page: number,
  pageSize: number,
  query: string = ""
): Promise<ExpenseWithColor[]> {
  const session = await verifySession();

  try {
    const skip = (page - 1) * pageSize;

    const data = await prisma.expense.findMany({
      where: {
        userId: session.userId,
        item: { startsWith: query, mode: "insensitive" }
      },
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
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Can't get paginated expenses");
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
    console.error(error);
    throw new Error("Can't get expense");
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
    console.error(error);
    throw new Error("Can't get first expense");
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
    console.error(error);
    throw new Error("Can't get budgets");
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
    console.error(error);
    throw new Error("Can't get budget");
  }
}

export async function saveRefreshToken(
  userId: User["id"],
  token: string,
  expiresAt: Date
): Promise<void> {
  try {
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        revokedAt: null
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Can't save refresh token");
  }
}

export async function getUserByRefreshToken(token: string): Promise<User | null> {
  try {
    const data = await prisma.user.findFirst({
      where: {
        refreshTokens: {
          some: {
            token,
            revokedAt: null
          }
        }
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Can't get user by refresh token");
  }
}
