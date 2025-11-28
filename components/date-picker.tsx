"use client";

import { ChevronDownIcon } from "lucide-react";

import { useController, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, type ChangeEvent } from "react";
import type { ExpenseInput } from "@/lib/expense/schemas";
import { format } from "date-fns";

type Props = {
  formControl: Control<ExpenseInput>;
};

export function DatePicker({ formControl }: Props) {
  const [open, setOpen] = useState(false);
  const { field, fieldState } = useController({
    name: "date",
    control: formControl
  });

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const newDate = new Date(field.value);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    field.onChange(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    selectedDate.setHours(field.value.getHours(), field.value.getMinutes());
    field.onChange(selectedDate);
    setOpen(false);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="date-picker" className="px-1">
        Date
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-32 justify-between font-normal"
            aria-invalid={fieldState.invalid}
          >
            {field.value ? format(field.value, "d MMM yyyy") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
          />
          <div className="flex justify-between gap-3 px-4 pb-3">
            <Label htmlFor="time-picker">Time</Label>
            <Input
              value={format(field.value, "kk:mm")}
              onChange={handleTimeChange}
              type="time"
              id="time-picker"
              className="bg-background w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
