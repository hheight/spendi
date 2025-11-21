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
import ContentWrapper from "@/components/expenses/content-wrapper";

export default function NotFound() {
  return (
    <ContentWrapper>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BanknoteX />
          </EmptyMedia>
          <EmptyTitle>Not found</EmptyTitle>
          <EmptyDescription>
            The expense you are trying to edit does not exist or is no longer available.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="/expenses"
            className="text-sm font-medium underline underline-offset-4"
          >
            Back to expenses
          </Link>
        </EmptyContent>
      </Empty>
    </ContentWrapper>
  );
}
