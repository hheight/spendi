import prisma from '@/app/lib/prisma';

export async function getAllUsers() {
  return await prisma.user.findMany();
}
