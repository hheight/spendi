import { vi, describe, expect, it, beforeAll, beforeEach } from "vitest";
import type { User } from "@/app/generated/prisma";
import {
  makeJWT,
  validateJWT,
  verifySession,
  refreshAccessToken
} from "@/lib/auth/session";
import { getUserByRefreshToken } from "@/lib/data";

vi.mock("@/lib/auth/config", () => ({
  config: {
    jwt: {
      secret: "test-secret",
      issuer: "spendi",
      defaultDuration: 3600,
      refreshDuration: 60 * 60 * 24 * 60 * 1000
    }
  }
}));

vi.mock("@/lib/data", () => ({
  getUserByRefreshToken: vi.fn(() => {}),
  saveRefreshToken: vi.fn(() => {})
}));

const mockSet = vi.fn();
const mockGet = vi.fn();
const mockDelete = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockSet,
      get: mockGet,
      delete: mockDelete
    })
  )
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`Redirect to ${url}`);
  })
}));

vi.mock("react", () => ({
  cache: vi.fn(fn => fn)
}));

describe("JWT Functions", () => {
  const secret = "test-secret";
  const wrongSecret = "wrong_secret";
  const userID = "some-unique-user-id";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, 3600, secret);
  });

  it("should validate a valid token", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should return null for an invalid token string", () => {
    const result = validateJWT("invalid.token.string", secret);
    expect(result).toBeNull();
  });

  it("should return null when the token is signed with a wrong secret", async () => {
    const result = validateJWT(validToken, wrongSecret);
    expect(result).toBeNull();
  });
});

describe("verifySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(undefined);
    mockSet.mockClear();
  });

  it("should return authenticated user when access token is valid", async () => {
    const validToken = makeJWT("user-123", 3600, "test-secret");
    mockGet.mockReturnValueOnce({ value: validToken });

    const result = await verifySession();

    expect(result).toEqual({ isAuth: true, userId: "user-123" });
  });

  it("should return authenticated user when access token is invalid but refresh token is valid", async () => {
    mockGet
      .mockReturnValueOnce({ value: "invalid-token" })
      .mockReturnValueOnce({ value: "valid-refresh-token" });

    vi.mocked(getUserByRefreshToken).mockResolvedValue({ id: "user-456" } as User);

    const result = await verifySession();

    expect(result).toEqual({ isAuth: true, userId: "user-456" });
  });

  it("should redirect to login when neither access nor refresh token is valid", async () => {
    mockGet
      .mockReturnValueOnce({ value: "invalid-access-token" })
      .mockReturnValueOnce({ value: "invalid-refresh-token" });

    vi.mocked(getUserByRefreshToken).mockResolvedValue(null);

    await expect(verifySession()).rejects.toThrow("Redirect to /login");
  });

  it("should redirect to login when no tokens are present", async () => {
    mockGet.mockReturnValue(undefined);

    await expect(verifySession()).rejects.toThrow("Redirect to /login");
  });
});

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSet.mockClear();
  });

  it("should return null when refresh token is not provided", async () => {
    const result = await refreshAccessToken(undefined);
    expect(result).toBeNull();
  });

  it("should return null when refresh token is not found in database", async () => {
    vi.mocked(getUserByRefreshToken).mockResolvedValue(null);

    const result = await refreshAccessToken("non-existent-token");

    expect(result).toBeNull();
  });

  it("should return user id and update access token when refresh token is valid", async () => {
    vi.mocked(getUserByRefreshToken).mockResolvedValue({ id: "user-789" } as User);

    const result = await refreshAccessToken("valid-refresh-token");

    expect(result).toBe("user-789");
    expect(mockSet).toHaveBeenCalledWith(
      "access_token",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/"
      })
    );
  });
});
