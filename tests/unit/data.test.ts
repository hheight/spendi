import { expect, test, vi } from 'vitest';
import { getAllUsers } from '@/lib/data';
import prisma from '@/lib/__mocks__/prisma';

vi.mock('@/lib/prisma');

const dateMock = new Date('01/01/01');

test('getAllUsers should return all users', async () => {
  const allUsers = [
    { id: '123', email: 'test', income: 0, createdAt: dateMock, updatedAt: dateMock }
  ];

  prisma.user.findMany.mockResolvedValue(allUsers);

  expect(await getAllUsers()).toStrictEqual(allUsers);
});
