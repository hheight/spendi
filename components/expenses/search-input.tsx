"use client";

import debounce from "debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startsWith = searchParams.get("startsWith");

  const setStartsWithParam = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams();
    params.set("startsWith", e.target.value);
    router.push(`?${params.toString()}`);
  };

  const handleInputChange = debounce(setStartsWithParam, 300);

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        defaultValue={startsWith || ""}
        placeholder="Search"
        className="pl-8"
        type="text"
        autoComplete="off"
        onChange={handleInputChange}
      />
    </div>
  );
}
