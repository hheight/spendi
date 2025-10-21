import { describe, expect, it } from 'vitest';
import prisma from '../helpers/prisma';
import { signup } from '@/app/actions/auth';

describe('Auth actions', async () => {
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
  });
});
