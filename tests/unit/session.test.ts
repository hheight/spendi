import { vi, describe, expect, it, beforeEach } from 'vitest';
import { encrypt, decrypt, createSession } from '@/lib/auth/session';
import { jwtVerify } from 'jose';

vi.mock('server-only', () => ({}));

const setProtectedHeader = vi.fn().mockReturnThis();
const setIssuedAt = vi.fn().mockReturnThis();
const setExpirationTime = vi.fn().mockReturnThis();
const sign = vi.fn().mockResolvedValue('mocked-token');
const mockCookiesSet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: mockCookiesSet
  }))
}));

vi.mock('jose', () => {
  return {
    SignJWT: vi.fn(() => ({
      setProtectedHeader,
      setIssuedAt,
      setExpirationTime,
      sign
    })),
    jwtVerify: vi.fn().mockResolvedValue({ payload: 'mocked-payload' })
  };
});

describe('Session management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('#encrypt', () => {
    it('calls SignJWT methods correctly', async () => {
      const payload = {
        userId: 'user-123',
        expiresAt: new Date('01/01/01')
      };

      const token = await encrypt(payload);

      expect(token).toBe('mocked-token');

      expect(setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
      expect(setIssuedAt).toHaveBeenCalled();
      expect(setExpirationTime).toHaveBeenCalledWith('1d');
      expect(sign).toHaveBeenCalled();
    });
  });

  describe('#decrypt', () => {
    it('calls jwtVerify function correctly', async () => {
      const payload = await decrypt('session-string');

      expect(jwtVerify).toHaveBeenCalledWith('session-string', expect.any(Uint8Array), {
        algorithms: ['HS256']
      });

      expect(payload).toBe('mocked-payload');
    });
  });

  describe('#createSession', () => {
    it('sets encrypted session in cookie', async () => {
      const fixedTime = new Date('2025-01-01T00:00:00Z');
      vi.setSystemTime(fixedTime);

      await createSession('user-123');

      const expectedExpires = new Date(fixedTime.getTime() + 24 * 60 * 60 * 1000);

      expect(mockCookiesSet).toHaveBeenCalledWith('session', 'mocked-token', {
        httpOnly: true,
        secure: true,
        expires: expectedExpires,
        sameSite: 'lax',
        path: '/'
      });
    });
  });
});
