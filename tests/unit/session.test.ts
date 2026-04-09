import { vi, describe, expect, it, beforeEach, beforeAll, afterAll } from "vitest";
import {
  makeJWT,
  validateJWT,
  createSession,
  deleteSession,
  updateSession
} from "@/lib/auth/session";

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

describe("Session management", () => {
  const expiresIn = 3600;
  const secret = "secret";
  const fixedTime = new Date("2025-01-01T00:00:00Z");
  let expiresAt: Date;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedTime);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    expiresAt = new Date(fixedTime.getTime() + expiresIn * 1000);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("#createSession", () => {
    it("should set session cookie with encrypted token", async () => {
      await createSession("user-123", expiresIn, secret);

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
        const token = makeJWT("user-123", expiresIn, secret);

        mockGet.mockReturnValue({ value: token });

        await updateSession(expiresIn, secret);

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

        const result = await updateSession(expiresIn, secret);

        expect(result).toBeNull();
      });
    });

    describe("when session cookie is invalid token", () => {
      it("should return null", async () => {
        mockGet.mockReturnValue({ value: "invalid-token" });

        const result = await updateSession(expiresIn, secret);

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
});

describe("JWT Functions", () => {
  const secret = "secret";
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
