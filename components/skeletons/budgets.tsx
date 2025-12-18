import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetsSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-[225px] w-full rounded-xl" />
      <Skeleton className="h-[160px] w-full rounded-xl" />
    </div>
  );
}
