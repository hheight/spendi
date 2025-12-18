import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetsSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[16px] w-[125px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-[20px] w-[80px]" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[50px] w-[100px]" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[16px] w-[125px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-[80px]" />
            <Skeleton className="h-[30px] w-[100px]" />
            <Skeleton className="h-[20px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
