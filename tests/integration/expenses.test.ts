import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { getExpenseById, getExpenses } from "@/lib/dal";
import { encrypt } from "@/lib/auth/session";

const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  })
}));

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

  describe("#getExpenses", () => {
    it("should return list of expenses", async () => {
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

      const result = await getExpenses();

      expect(result).toHaveLength(2);

      expect(result).toMatchObject([
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

      const result = await getExpenses();

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

      const result = await getExpenses();

      expect(result).toEqual([]);
    });

    it("should throw when not authenticated", async () => {
      mockGet.mockReturnValue(undefined);

      await expect(getExpenses()).rejects.toThrow();
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

    it("should throw when not authenticated", async () => {
      mockGet.mockReturnValue(undefined);

      await expect(getExpenses()).rejects.toThrow();
    });
  });
});
