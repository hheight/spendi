"use client";

import debounce from "debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query");

  const setStartsWithParam = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const params = new URLSearchParams();
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  };

  const handleInputChange = debounce(setStartsWithParam, 300);

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        defaultValue={query || ""}
        placeholder="Search"
        className="pl-8"
        type="text"
        autoComplete="off"
        onChange={handleInputChange}
      />
    </div>
  );
}
