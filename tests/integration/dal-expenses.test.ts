import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { getExpensesByCategory } from "@/lib/dal";
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

describe("#getExpensesByCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return expenses grouped by category", async () => {
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
        { value: 100, userId: user.id, categoryId: foodCategory.id, item: "Fruits" },
        { value: 50, userId: user.id, categoryId: foodCategory.id, item: "Meat" },
        { value: 200, userId: user.id, categoryId: transportCategory.id, item: "Tickets" }
      ]
    });

    const token = await encrypt({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await getExpensesByCategory();

    expect(result).toHaveLength(2);

    const foodGroup = result?.find(g => g.categoryId === foodCategory.id);
    const transportGroup = result?.find(g => g.categoryId === transportCategory.id);

    expect(foodGroup?._sum.value).toBe(150);
    expect(transportGroup?._sum.value).toBe(200);
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

    const result = await getExpensesByCategory();

    expect(result).toHaveLength(1);
    expect(result?.[0].categoryId).toBe(category1.id);
    expect(result?.[0]._sum.value).toBe(100);
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

    const result = await getExpensesByCategory();

    expect(result).toEqual([]);
  });

  it("should correctly sum multiple expenses in same category", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: { create: { hash: "hashed" } }
      }
    });

    const category = await prisma.category.create({
      data: { name: "Food", color: "#FF0000", userId: user.id }
    });

    await prisma.expense.createMany({
      data: [
        { value: 10.5, userId: user.id, categoryId: category.id, item: "Apple" },
        { value: 25.75, userId: user.id, categoryId: category.id, item: "Chicken" },
        { value: 13.25, userId: user.id, categoryId: category.id, item: "Berries" }
      ]
    });

    const token = await encrypt({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await getExpensesByCategory();

    expect(result).toHaveLength(1);
    expect(result?.[0]._sum.value).toBe(49.5);
  });

  it("should throw when not authenticated", async () => {
    mockGet.mockReturnValue(undefined);

    await expect(getExpensesByCategory()).rejects.toThrow();
  });
});
