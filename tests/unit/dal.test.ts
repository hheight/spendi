import { vi, describe, expect, it, beforeEach } from "vitest";

import { makeJWT } from "@/lib/auth/session";

vi.stubEnv("SESSION_SECRET", "test-secret");

const { verifySession } = await import("@/lib/dal");

const mockGet = vi.fn();

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
    const userId = "user-123";
    const token = makeJWT(userId, 3600, "test-secret");

    mockGet.mockReturnValue({ value: token });

    const result = await verifySession();

    expect(result).toEqual({ isAuth: true, userId });
  });

  it("returns falsed authentication when no session", async () => {
    mockGet.mockReturnValue(undefined);

    const result = await verifySession();

    expect(result).toEqual({ isAuth: false });
  });

  it("returns falsed authentication when session is invalid", async () => {
    mockGet.mockReturnValue({ value: "invalid-token" });

    const result = await verifySession();

    expect(result).toEqual({ isAuth: false });
  });
});

vi.unstubAllEnvs();
