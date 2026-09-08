"use client";

import { Input } from "@/components/ui/input";



type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function AgencySearch({
  value,
  onChange,
}: Props) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder="Search agencies by name..."
      aria-label="Search agencies by name"
      className="max-w-sm"
    />
  );
}