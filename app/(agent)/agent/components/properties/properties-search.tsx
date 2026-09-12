"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function PropertySearch() {
  return (
    <div className="relative w-full sm:w-[290px]">
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
        aria-hidden="true"
      />

      <Input
        type="search"
        placeholder="Search"
        className="h-10 pl-9"
      />
    </div>
  );
}