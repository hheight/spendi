import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { getBudgets, getBudgetById } from "@/lib/dal";
import { encrypt } from "@/lib/auth/session";
import { BudgetType } from "@/app/generated/prisma";

const mockGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: mockGet
    })
  )
}));

describe("budgets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("#getBudgets", () => {
    it("should return list of budgets", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      await prisma.budget.createMany({
        data: [
          { value: 500, userId: user.id, categoryId: null, type: BudgetType.OVERALL },
          {
            value: 50,
            userId: user.id,
            categoryId: foodCategory.id,
            type: BudgetType.CATEGORY
          }
        ]
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getBudgets();

      expect(result).toMatchObject([
        { category: null, type: BudgetType.OVERALL, value: 500 },
        {
          category: {
            id: foodCategory.id,
            name: foodCategory.name,
            color: foodCategory.color
          },
          type: BudgetType.CATEGORY,
          value: 50
        }
      ]);
    });

    it("should only return budgets for current user", async () => {
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

      await prisma.budget.create({
        data: { value: 500, userId: user1.id, categoryId: null, type: BudgetType.OVERALL }
      });
      await prisma.budget.create({
        data: {
          value: 50,
          userId: user2.id,
          categoryId: null,
          type: BudgetType.OVERALL
        }
      });

      const token = await encrypt({
        userId: user1.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getBudgets();

      expect(result).toMatchObject([
        { category: null, type: BudgetType.OVERALL, value: 500 }
      ]);
    });

    it("should return empty array when user has no budgets", async () => {
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

      const result = await getBudgets();

      expect(result).toEqual([]);
    });
  });

  describe("#getExpenseById", () => {
    it("should return existing budget", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: { create: { hash: "hashed" } }
        }
      });

      const foodCategory = await prisma.category.create({
        data: { name: "Food", color: "#FF0000", userId: user.id }
      });

      const budget = await prisma.budget.create({
        data: {
          value: 50,
          userId: user.id,
          categoryId: foodCategory.id,
          type: BudgetType.OVERALL
        }
      });

      const token = await encrypt({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000000)
      });
      mockGet.mockReturnValue({ value: token });

      const result = await getBudgetById(budget.id);

      expect(result).toMatchObject({
        id: budget.id,
        category: {
          id: foodCategory.id,
          name: foodCategory.name,
          color: foodCategory.color
        },
        type: budget.type,
        value: budget.value
      });
    });

    it("should return null when budget not found", async () => {
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

      const result = await getBudgetById("non-exist");

      expect(result).toEqual(null);
    });
  });
});
