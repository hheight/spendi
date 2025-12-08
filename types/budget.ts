import type { Prisma } from "@/app/generated/prisma";

export type Budget = Prisma.BudgetGetPayload<{
  select: {
    id: true;
    type: true;
    value: true;
    createdAt: true;
    category: {
      select: {
        id: true;
        name: true;
        color: true;
      };
    };
  };
}>;
