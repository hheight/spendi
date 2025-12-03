"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { buildMonthSelectOptions } from "@/lib/utils";
import { format } from "date-fns";

const now = new Date();
const defaultOptions = [
  {
    label: format(now, "MMM yyyy"),
    value: format(now, "yyyy-MM")
  }
];

export default function MonthSelect({ startDate }: { startDate: Date }) {
  const [options, setOptions] =
    useState<Array<{ value: string; label: string }>>(defaultOptions);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedMonth = searchParams.get("month");

  useEffect(() => {
    const monthOptions = buildMonthSelectOptions(startDate);
    setOptions(monthOptions);
  }, []);

  const handleChange = (value: string) => {
    const params = new URLSearchParams();
    if (value !== defaultOptions[0].value) {
      params.set("month", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleChange} value={selectedMonth || options[0]?.value}>
      <SelectTrigger className="text-muted-foreground cursor-pointer rounded-none border-0 bg-transparent p-0 text-sm font-medium uppercase shadow-none data-[size=default]:h-[1lh] dark:bg-transparent">
        <SelectValue placeholder="Choose month" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
