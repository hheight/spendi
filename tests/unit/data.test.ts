import { expect, test, vi } from 'vitest';
import { getAllUsers } from '@/app/lib/data';
import prisma from '@/lib/__mocks__/prisma';

vi.mock('@/lib/prisma');

test('getAllUsers should return all users', async () => {
  const allUsers = [{ id: 1, email: 'test', income: 0 }];

  prisma.user.findMany.mockResolvedValue(allUsers);

  expect(await getAllUsers()).toStrictEqual(allUsers);
});
