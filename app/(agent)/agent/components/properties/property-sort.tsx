"use client";

import { ArrowDownUp, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PropertySort() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2"
        >
          <ArrowDownUp className="size-4" />

          <span className="hidden sm:inline">
            Newest to Oldest
          </span>

          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Check className="mr-2 size-4" />
          Newest to Oldest
        </DropdownMenuItem>

        <DropdownMenuItem>
          Oldest to Newest
        </DropdownMenuItem>

        <DropdownMenuItem>
          Price: Low to High
        </DropdownMenuItem>

        <DropdownMenuItem>
          Price: High to Low
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}