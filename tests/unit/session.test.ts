import { vi, describe, expect, it, beforeEach, beforeAll, afterAll } from "vitest";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import {
  encrypt,
  decrypt,
  createSession,
  deleteSession,
  updateSession
} from "@/lib/auth/session";

const mockSet = vi.fn();
const mockGet = vi.fn();
const mockDelete = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  })
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockSet,
      get: mockGet,
      delete: mockDelete
    })
  )
}));

describe("Session management", () => {
  const fixedTime = new Date("2025-01-01T00:00:00Z");
  const expiresAt = new Date(fixedTime.getTime() + 7 * 24 * 60 * 60 * 1000);

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedTime);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("#encrypt", () => {
    it("creates a valid JWT token", async () => {
      const payload = {
        userId: "user-123",
        expiresAt
      };

      const token = await encrypt(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("creates different tokens for different users", async () => {
      const token1 = await encrypt({ userId: "user-123", expiresAt });
      const token2 = await encrypt({ userId: "user-456", expiresAt });

      expect(token1).not.toBe(token2);
    });
  });

  describe("#decrypt", () => {
    it("decrypts valid token successfully", async () => {
      const token = await encrypt({
        userId: "user-456",
        expiresAt
      });

      const payload = await decrypt(token);

      expect(payload?.userId).toBe("user-456");
    });

    it("returns null for invalid token", async () => {
      const result = await decrypt("invalid-token");

      expect(result).toBeNull();
    });
  });

  describe("#createSession", () => {
    it("should set session cookie with encrypted token", async () => {
      await createSession("user-123");

      expect(mockSet).toHaveBeenCalledWith("session", expect.stringMatching(/^ey/), {
        expires: expiresAt,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });
    });
  });

  describe("#updateSession", () => {
    describe("when have valid session", () => {
      it("should update session cookie with encrypted token", async () => {
        const token = await encrypt({
          userId: "user-456",
          expiresAt: new Date(fixedTime.getTime() + 1 * 24 * 60 * 60 * 1000)
        });

        mockGet.mockReturnValue({ value: token });

        await updateSession();

        expect(mockGet).toHaveBeenCalledWith("session");
        expect(mockSet).toHaveBeenCalledWith("session", expect.stringMatching(/^ey/), {
          expires: expiresAt,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });
      });
    });

    describe("when session cookie is empty", () => {
      it("should return null", async () => {
        mockGet.mockReturnValue({ value: "" });

        const result = await updateSession();

        expect(result).toBeNull();
      });
    });

    describe("when session cookie is invalid token", () => {
      it("should return null", async () => {
        mockGet.mockReturnValue({ value: "invalid-token" });

        const result = await updateSession();

        expect(result).toBeNull();
      });
    });
  });

  describe("#deleteSession", () => {
    it("should delete the session cookie", async () => {
      await deleteSession();

      expect(mockDelete).toHaveBeenCalledWith("session");
    });
  });

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
});
