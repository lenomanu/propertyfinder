"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PropertyFilter() {
  return (
    <Button
      variant="outline"
      className="h-10 gap-2"
    >
      <SlidersHorizontal className="size-4" />
      Filter
    </Button>
  );
}