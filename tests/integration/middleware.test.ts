import { vi, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import middleware from '@/middleware';
import { encrypt } from '@/lib/auth/session';

describe('Middleware', () => {
  describe('Protected routes', () => {
    const protectedRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/expenses', name: 'Expenses' },
      { path: '/income', name: 'Income' }
    ];

    describe('Unauthorized access', () => {
      protectedRoutes.forEach(({ path, name }) => {
        it(`should redirect to /login when accessing ${name} with invalid session`, async () => {
          const request = new NextRequest(new URL(path, 'http://localhost:3000'), {
            headers: {
              cookie: 'session=invalid-session-token'
            }
          });

          const response = await middleware(request);

          expect(response).toBeDefined();
          expect(response.status).toBe(307);
          expect(response.headers.get('location')).toContain('/login');
        });

        it(`should redirect to /login when accessing ${name} with expired session`, async () => {
          vi.useFakeTimers();

          const expiredPayload = {
            userId: 'user-123',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          };

          const expiredToken = await encrypt(expiredPayload);

          const request = new NextRequest(new URL(path, 'http://localhost:3000'), {
            headers: {
              cookie: `session=${expiredToken}`
            }
          });

          const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
          vi.setSystemTime(date);

          const response = await middleware(request);

          expect(response).toBeDefined();
          expect(response.status).toBe(307);
          expect(response.headers.get('location')).toContain('/login');

          vi.useRealTimers();
        });
      });
    });

    describe('Authorized access', () => {
      protectedRoutes.forEach(({ path, name }) => {
        it(`should allow access to ${name} with valid session`, async () => {
          const payload = {
            userId: 'user-123',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          };

          const validToken = await encrypt(payload);

          const request = new NextRequest(new URL(path, 'http://localhost:3000'), {
            headers: {
              cookie: `session=${validToken}`
            }
          });

          const response = await middleware(request);

          expect(response).toBeDefined();
          expect(response.status).toBe(200);
        });
      });
    });
  });

  describe('Public routes', () => {
    const publicRoutes = [
      { path: '/', name: 'Home' },
      { path: '/login', name: 'Login' },
      { path: '/signup', name: 'Sign Up' }
    ];

    publicRoutes.forEach(({ path, name }) => {
      it(`should allow unauthenticated access to ${name}`, async () => {
        const request = new NextRequest(new URL(path, 'http://localhost:3000'));

        const response = await middleware(request);

        expect(response).toBeDefined();
        expect(response.status).toBe(200);
      });

      it(`should redirect to /dashboard when accessing ${name} with valid session`, async () => {
        const payload = {
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        const validToken = await encrypt(payload);

        const request = new NextRequest(new URL(path, 'http://localhost:3000'), {
          headers: {
            cookie: `session=${validToken}`
          }
        });

        const response = await middleware(request);

        expect(response).toBeDefined();
        expect(response.status).toBe(307);
        expect(response.headers.get('location')).toContain('/dashboard');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle paths with query parameters', async () => {
      const request = new NextRequest(
        new URL('/dashboard?tab=overview', 'http://localhost:3000')
      );

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      expect(response?.headers.get('location')).toContain('/login');
    });

    it('should handle paths with subpaths', async () => {
      const request = new NextRequest(
        new URL('/dashboard/protected', 'http://localhost:3000')
      );

      const response = await middleware(request);

      expect(response).toBeDefined();
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/login');
    });
  });
});
