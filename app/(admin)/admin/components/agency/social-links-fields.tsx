"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function SocialLinkField({
  id,
  name,
  label,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label}
        </Label>

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline underline-offset-4"
          >
            Open ↗
          </a>
        )}
      </div>

      <Input
        id={id}
        name={name}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="https://..."
      />
    </div>
  );
}