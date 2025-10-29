import { vi, describe, expect, it, beforeEach } from "vitest";
import prisma from "@/tests/helpers/prisma";
import { signup, login } from "@/app/actions/auth";
import bcrypt from "bcryptjs";

vi.mock("@/lib/auth/session", () => ({
  createSession: vi.fn()
}));

describe("Auth actions", () => {
  describe("#signup", () => {
    it("should create a new user with valid data", async () => {
      const result = await signup({
        email: "test@example.com",
        password: "Password123",
        confirm: "Password123"
      });

      expect(result.success).toBe(true);

      const user = await prisma.user.findUnique({
        where: { email: "test@example.com" }
      });

      expect(user).toBeDefined();
    });

    it("should return an error if user already exists", async () => {
      const hashedPassword = await bcrypt.hash("Password123", 10);

      await prisma.user.create({
        data: {
          email: "test@example.com",
          password: {
            create: {
              hash: hashedPassword
            }
          }
        }
      });

      const result = await signup({
        email: "test@example.com",
        password: "Password123",
        confirm: "Password123"
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("An account with this email already exists");
    });

    it("should validate password requirements", async () => {
      const result = await signup({
        email: "test@example.com",
        password: "weakpass",
        confirm: "weakpass"
      });

      expect(result.success).toBe(false);
    });
  });

  describe("#signin", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("Password123", 10);
      await prisma.user.create({
        data: {
          email: "test@example.com",
          password: {
            create: {
              hash: hashedPassword
            }
          }
        }
      });
    });

    it("should login a user with valid credentials", async () => {
      const result = await login({
        email: "test@example.com",
        password: "Password123"
      });

      expect(result.success).toBe(true);
    });

    it("should return an error if email is invalid", async () => {
      const result = await login({
        email: "wrong@example.com",
        password: "Password123"
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid email or password");
    });

    it("should return an error if password is invalid", async () => {
      const result = await login({
        email: "test@example.com",
        password: "WrongPass123"
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid email or password");
    });
  });
});
