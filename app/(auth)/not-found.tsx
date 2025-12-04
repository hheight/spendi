import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Ban } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Ban />
            </EmptyMedia>
            <EmptyTitle>404 | Not found</EmptyTitle>
            <EmptyDescription>
              Something went wrong. Try to refresh page or go back to dashboard.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/dashboard"
              className="text-sm font-medium underline underline-offset-4"
            >
              Back to dashboard
            </Link>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
