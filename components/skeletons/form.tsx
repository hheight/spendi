import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-[20px] w-[150px]" />
        </CardTitle>
        <CardAction>
          <Skeleton className="h-[30px] w-[30px]" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-[20px] w-[80px]" />
            <Skeleton className="h-[30px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[20px] w-[130px]" />
            <Skeleton className="h-[30px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[20px] w-[100px]" />
            <Skeleton className="h-[30px] w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4">
          <Skeleton className="h-[36px] w-[80px]" />
          <Skeleton className="h-[36px] w-[80px]" />
        </div>
      </CardFooter>
    </Card>
  );
}
