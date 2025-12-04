"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  onDelete: () => Promise<void>;
  itemName?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

export function DeleteButton({
  onDelete,
  itemName = "item",
  triggerVariant = "ghost",
  triggerSize = "icon"
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete();
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          disabled={isPending}
          aria-label={`Delete ${itemName}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Delete {itemName}</h4>
            <p className="text-muted-foreground text-sm">
              This action cannot be undone. Are you sure you want to delete this{" "}
              {itemName}?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
