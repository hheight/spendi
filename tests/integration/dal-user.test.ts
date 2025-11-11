import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { getUserIncome } from "@/lib/dal";
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

  it("should return income for authenticated user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: { create: { hash: "hashed" } },
        income: 2000
      }
    });

    const token = await encrypt({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000000)
    });

    mockGet.mockReturnValue({ value: token });

    const result = await getUserIncome();

    expect(result).toStrictEqual({ income: 2000 });
  });

  it("should only return income for current user", async () => {
    const user1 = await prisma.user.create({
      data: {
        email: "user1@example.com",
        password: { create: { hash: "hashed" } },
        income: 2000
      }
    });
    await prisma.user.create({
      data: {
        email: "user2@example.com",
        password: { create: { hash: "hashed" } },
        income: 1000
      }
    });

    const token = await encrypt({
      userId: user1.id,
      expiresAt: new Date(Date.now() + 1000000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await getUserIncome();

    expect(result).toStrictEqual({ income: 2000 });
  });

  it("should return null when not authenticated", async () => {
    mockGet.mockReturnValue(undefined);

    await expect(getUserIncome()).rejects.toThrow();
  });
});
