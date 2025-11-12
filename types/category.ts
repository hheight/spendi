import type { Prisma } from "@/app/generated/prisma";

export type CategoryPreview = Prisma.CategoryGetPayload<{
  select: { id: true; name: true; color: true };
}>;
