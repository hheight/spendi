import type { Prisma } from "@/app/generated/prisma";

export type UserIncome = Prisma.UserGetPayload<{
  select: { income: true };
}>;

export type UserCreatedAt = Prisma.UserGetPayload<{
  select: { createdAt: true };
}>;
