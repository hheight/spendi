import { vi, describe, it, beforeEach, expect } from "vitest";
import { verifySession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
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

describe("#verifySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns userId when session is valid", async () => {
    const token = await encrypt({
      userId: "user-123",
      expiresAt: new Date(Date.now() + 1000)
    });
    mockGet.mockReturnValue({ value: token });

    const result = await verifySession();

    expect(result).toEqual({ isAuth: true, userId: "user-123" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /login when no session", async () => {
    mockGet.mockReturnValue(undefined);

    await expect(verifySession()).rejects.toThrow();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login when session is invalid", async () => {
    mockGet.mockReturnValue({ value: "invalid-token" });

    await expect(verifySession()).rejects.toThrow();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
