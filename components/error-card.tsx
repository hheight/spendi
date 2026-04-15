import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ErrorCard({ reset }: { reset: () => void }) {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Ban />
            </EmptyMedia>
            <EmptyTitle>Something went wrong!</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => reset()}>Refresh</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
