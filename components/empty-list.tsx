import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Inbox } from "lucide-react";

export default function EmptyList() {
  return (
    <Empty className="text-muted-foreground">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No entries found.</EmptyTitle>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
