import { Skeleton } from "@/components/ui/skeleton";

export default function ExpensesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Skeleton className="h-[20px] w-[70px]" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[40px] w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[20px] w-[90px]" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-[40px] w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[20px] w-[70px]" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[40px] w-full" />
        </div>
      </div>
    </div>
  );
}
