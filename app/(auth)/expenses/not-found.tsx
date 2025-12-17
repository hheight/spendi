import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { BanknoteX } from "lucide-react";
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
              The page you are trying to reach does not exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <a
              href="/expenses"
              className="text-sm font-medium underline underline-offset-4"
            >
              Back to expenses
            </a>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
