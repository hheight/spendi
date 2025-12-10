import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import {
  getExpenseById,
  getCompletedExpenses,
  getUpcomingExpenses,
  getExpensesByDateRange,
  getExpensesByCategory
} from "@/lib/dal";
import { encrypt } from "@/lib/auth/session";

const mockGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: mockGet
    })
  )
}));

describe("expenses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("#getCompletedExpenses", () => {
    it("should return list of completed expenses", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      await prisma.expense.createMany({
        data: [
          { value: 100, userId: user.id, categoryId: foodCategory.id, item: "Fruits" },
          { value: 50, userId: user.id, categoryId: foodCategory.id, item: "Meat" }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getCompletedExpenses();

      expect(result).toMatchObject({
        currentPage: 1,
        expenses: [
          {
            item: "Fruits",
            value: 100,
            category: {
              color: foodCategory.color
            }
          },
          {
            item: "Meat",
            value: 50,
            category: {
              color: foodCategory.color
            }
          }
        ],
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1
      });
    });

    it("should return paginated list of completed expenses", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      await prisma.expense.createMany({
        data: [
          { value: 10, userId: user.id, categoryId: foodCategory.id, item: "Item1" },
          { value: 20, userId: user.id, categoryId: foodCategory.id, item: "Item2" },
          { value: 30, userId: user.id, categoryId: foodCategory.id, item: "Item3" },
          { value: 40, userId: user.id, categoryId: foodCategory.id, item: "Item4" },
          { value: 50, userId: user.id, categoryId: foodCategory.id, item: "Item5" },
          { value: 60, userId: user.id, categoryId: foodCategory.id, item: "Item6" },
          { value: 70, userId: user.id, categoryId: foodCategory.id, item: "Item7" }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getCompletedExpenses(2, 5);

      expect(result).toMatchObject({
        currentPage: 2,
        expenses: [
          {
            item: "Item6",
            value: 60,
            category: {
              color: foodCategory.color
            }
          },
          {
            item: "Item7",
            value: 70,
            category: {
              color: foodCategory.color
            }
          }
        ],
        hasNextPage: false,
        hasPreviousPage: true,
        totalPages: 2
      });
    });

    it("should only return expenses for current user", async () => {
      const user1 = await prisma.user.create({
        data: {
          email: "user1@example.com",
          password: { create: { hash: "hashed" } }
        }
      });
      const user2 = await prisma.user.create({
        data: {
          email: "user2@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const category1 = await prisma.category.create({
        data: { name: "Category1", color: "#FF0000", userId: user1.id }
      });
      const category2 = await prisma.category.create({
        data: { name: "Category2", color: "#00FF00", userId: user2.id }
      });

      await prisma.expense.create({
        data: { value: 100, userId: user1.id, categoryId: category1.id, item: "Item1" }
      });
      await prisma.expense.create({
        data: { value: 500, userId: user2.id, categoryId: category2.id, item: "Item2" }
      });

      const token = await encrypt({
        userId: user1.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getCompletedExpenses();

      expect(result).toMatchObject({
        currentPage: 1,
        expenses: [{ item: "Item1", value: 100, category: { color: category1.color } }],
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1
      });
    });

    it("should return empty array when user has no expenses", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getCompletedExpenses();

      expect(result).toEqual({
        currentPage: 1,
        expenses: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0
      });
    });
  });

  describe("#getUpcomingExpenses", () => {
    it("should return ordered list of upcoming expenses", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      await prisma.expense.createMany({
        data: [
          {
            value: 100,
            userId: user.id,
            categoryId: foodCategory.id,
            item: "Fruits",
            createdAt: new Date(Date.now() + 100000)
          },
          {
            value: 50,
            userId: user.id,
            categoryId: foodCategory.id,
            item: "Meat",
            createdAt: new Date(Date.now() + 200000)
          }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getUpcomingExpenses();

      expect(result).toHaveLength(2);

      expect(result).toMatchObject([
        {
          item: "Meat",
          value: 50,
          category: {
            color: foodCategory.color
          }
        },
        {
          item: "Fruits",
          value: 100,
          category: {
            color: foodCategory.color
          }
        }
      ]);
    });

    it("should only return expenses for current user", async () => {
      const user1 = await prisma.user.create({
        data: {
          email: "user1@example.com",
          password: { create: { hash: "hashed" } }
        }
      });
      const user2 = await prisma.user.create({
        data: {
          email: "user2@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const category1 = await prisma.category.create({
        data: { name: "Category1", color: "#FF0000", userId: user1.id }
      });
      const category2 = await prisma.category.create({
        data: { name: "Category2", color: "#00FF00", userId: user2.id }
      });

      const expense1 = await prisma.expense.create({
        data: {
          value: 100,
          userId: user1.id,
          categoryId: category1.id,
          item: "Item1",
          createdAt: new Date(Date.now() + 100000)
        }
      });
      await prisma.expense.create({
        data: { value: 500, userId: user2.id, categoryId: category2.id, item: "Item2" }
      });

      const token = await encrypt({
        userId: user1.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getUpcomingExpenses();

      expect(result).toHaveLength(1);

      expect(result?.[0].id).toBe(expense1.id);
      expect(result?.[0].category.color).toBe(category1.color);
    });

    it("should return empty array when user has no expenses", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getUpcomingExpenses();

      expect(result).toEqual([]);
    });
  });

  describe("#getExpenseById", () => {
    it("should return existing expense", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      const expense = await prisma.expense.create({
        data: { value: 100, userId: user.id, categoryId: foodCategory.id, item: "Fruits" }
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getExpenseById(expense.id);

      expect(result).toMatchObject({
        id: expense.id,
        item: expense.item,
        categoryId: expense.categoryId,
        value: expense.value
      });
    });

    it("should return null when expense not found", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getExpenseById("non-exist");

      expect(result).toEqual(null);
    });
  });

  describe("#getExpensesByDateRange", () => {
    it("should return expenses within date range", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const category = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-31");

      await prisma.expense.createMany({
        data: [
          {
            item: "Coffee",
            value: 5,
            userId: user.id,
            categoryId: category.id,
            createdAt: new Date("2025-01-10")
          },
          {
            item: "Lunch",
            value: 15,
            userId: user.id,
            categoryId: category.id,
            createdAt: new Date("2025-01-15")
          },
          {
            item: "Dinner",
            value: 30,
            userId: user.id,
            categoryId: category.id,
            createdAt: new Date("2025-02-05")
          }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getExpensesByDateRange(startDate, endDate);

      expect(result).toHaveLength(2);
      expect(result?.[0].item).toBe("Lunch");
      expect(result?.[1].item).toBe("Coffee");
    });
  });

  describe("#getExpensesByCategory", () => {
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-01-31");

    it("should return expenses grouped by category with correct sum within date range", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      const transportCategory = await prisma.category.create({
        data: { name: "Transport", color: "#00FF00", userId: user.id }
      });

      await prisma.expense.createMany({
        data: [
          {
            value: 100,
            userId: user.id,
            categoryId: foodCategory.id,
            item: "Fruits",
            createdAt: new Date("2025-01-10")
          },
          {
            value: 50,
            userId: user.id,
            categoryId: transportCategory.id,
            item: "Bus",
            createdAt: new Date("2025-01-16")
          },
          {
            value: 50,
            userId: user.id,
            categoryId: foodCategory.id,
            item: "Meat",
            createdAt: new Date("2025-01-15")
          },
          {
            value: 200,
            userId: user.id,
            categoryId: transportCategory.id,
            item: "Tickets",
            createdAt: new Date("2025-02-15")
          }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getExpensesByCategory(startDate, endDate);

      expect(result).toHaveLength(2);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            categoryId: foodCategory.id,
            _sum: { value: 150 }
          }),
          expect.objectContaining({
            categoryId: transportCategory.id,
            _sum: { value: 50 }
          })
        ])
      );
    });
  });
});
