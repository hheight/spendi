import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ExpensesSkeleton from "./expenses";

export default function DashboardDataSkeleton() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[48px] w-[80px]" />
          </CardTitle>
          <CardAction>
            <Skeleton className="h-[48px] w-[80px]" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video justify-center">
            <div className="min-h-[200px] w-full">
              <div className="h-full pb-8 pl-8 pr-2">
                <Skeleton className="h-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <ExpensesSkeleton />
        </CardContent>
      </Card>
    </>
  );
}
