"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Props = {
  options: {
    value: string;
    label: string;
  }[];
};

export default function MonthSelect({ options }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedMonth = searchParams.get("month");

  const handleChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("month", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleChange} value={selectedMonth || options[0]?.value}>
      <SelectTrigger
        id="month-select-trigger"
        className="text-muted-foreground cursor-pointer rounded-none border-0 bg-transparent p-0 text-sm font-medium uppercase shadow-none data-[size=default]:h-[1lh] dark:bg-transparent"
      >
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
