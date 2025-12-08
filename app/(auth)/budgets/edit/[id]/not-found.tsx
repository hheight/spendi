import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { BanknoteX } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BanknoteX />
            </EmptyMedia>
            <EmptyTitle>Not found</EmptyTitle>
            <EmptyDescription>
              The budget you are trying to edit does not exist or is no longer available.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/budgets"
              className="text-sm font-medium underline underline-offset-4"
            >
              Back to budgets
            </Link>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
