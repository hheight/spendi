import { describe, expect, it } from 'vitest';
import { encrypt, decrypt } from '@/lib/auth/session';

describe('Session management', () => {
  describe('#encrypt', () => {
    it('creates a valid JWT token', async () => {
      const payload = {
        userId: 'user-123',
        expiresAt: new Date('2025-12-31')
      };

      const token = await encrypt(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('#decrypt', () => {
    it('decrypts valid token successfully', async () => {
      const token = await encrypt({
        userId: 'user-456',
        expiresAt: new Date('2025-12-31')
      });

      const payload = await decrypt(token);

      expect(payload?.userId).toBe('user-456');
    });

    it('returns null for invalid token', async () => {
      const result = await decrypt('invalid-token');

      expect(result).toBeNull();
    });
  });
});
