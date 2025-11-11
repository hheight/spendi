import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { getCategories } from "@/lib/dal";
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

describe("#getCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return categories for authenticated user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: { create: { hash: "hashed" } }
      }
    });

    await prisma.category.createMany({
      data: [
        { name: "Food", color: "#FF0000", userId: user.id },
        { name: "Transport", color: "#00FF00", userId: user.id }
      ]
    });

    const token = await encrypt({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000000)
    });

    mockGet.mockReturnValue({ value: token });

    const result = await getCategories();

    expect(result).toHaveLength(2);
    expect(result?.[0]).toMatchObject({ name: "Food", color: "#FF0000" });
    expect(result?.[1]).toMatchObject({ name: "Transport", color: "#00FF00" });
  });

  it("should only return categories for current user", async () => {
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

    await prisma.category.create({
      data: { name: "User1 Category", color: "#FF0000", userId: user1.id }
    });
    await prisma.category.create({
      data: { name: "User2 Category", color: "#00FF00", userId: user2.id }
    });

    const token = await encrypt({
      userId: user1.id,
      expiresAt: new Date(Date.now() + 1000000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await getCategories();

    expect(result).toHaveLength(1);
    expect(result?.[0].name).toBe("User1 Category");
  });

  it("should return null when not authenticated", async () => {
    mockGet.mockReturnValue(undefined);

    await expect(getCategories()).rejects.toThrow();
  });

  it("should return categories sorted by name", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: { create: { hash: "hashed" } }
      }
    });

    await prisma.category.createMany({
      data: [
        { name: "Zebra", color: "#000000", userId: user.id },
        { name: "Apple", color: "#111111", userId: user.id },
        { name: "Mango", color: "#222222", userId: user.id }
      ]
    });

    const token = await encrypt({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await getCategories();

    expect(result?.[0].name).toBe("Apple");
    expect(result?.[1].name).toBe("Mango");
    expect(result?.[2].name).toBe("Zebra");
  });
});
