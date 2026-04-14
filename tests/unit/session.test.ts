import { vi, describe, expect, it, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "@/lib/auth/session";

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
