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

export default function EmptyList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteX />
        </EmptyMedia>
        <EmptyTitle>No Data</EmptyTitle>
        <EmptyDescription>
          Get started by <Link href="/expenses/add">adding expenses</Link>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
