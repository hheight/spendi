import type { Prisma } from "@/app/generated/prisma";

export type UserIncome = Prisma.UserGetPayload<{
  select: { income: true };
}>;
