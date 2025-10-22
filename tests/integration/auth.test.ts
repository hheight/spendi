import { vi, describe, expect, it, beforeEach } from 'vitest';
import prisma from '../helpers/prisma';
import { signup } from '@/app/actions/auth';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth/session';

vi.mock('@/lib/auth/session', () => ({
  createSession: vi.fn()
}));

describe('Auth actions', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('#signup', () => {
    it('should create a new user with valid data', async () => {
      const result = await signup({
        email: 'test@example.com',
        password: 'Password123'
      });

      expect(result.success).toBe(true);

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(user).toBeDefined();
    });

    it('should return an error if user already exists', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 10);

      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: {
            create: {
              hash: hashedPassword
            }
          }
        }
      });

      const result = await signup({
        email: 'test@example.com',
        password: 'Password123'
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
    });

    it('should validate password requirements', async () => {
      const result = await signup({
        email: 'test@example.com',
        password: 'weakpass'
      });

      expect(result.success).toBe(false);
    });

    it('createSession should be called with new user id', async () => {
      await signup({
        email: 'test@example.com',
        password: 'Password123'
      });

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(createSession).toHaveBeenCalledOnce();
      expect(createSession).toBeCalledWith(user?.id);
    });
  });
});
