"use client";

import { Sparkles } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";

const iconNameSet = new Set<string>(iconNames);

function toIconName(value: string) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])(\d+)/g, "$1-$2")
    .toLowerCase();
}

export default function AmenityIcon({ name }: { name: string | null }) {
  const iconName = name ? toIconName(name) : "";

  if (!iconNameSet.has(iconName)) {
    return <Sparkles className="h-5 w-5" aria-hidden="true" />;
  }

  return (
    <DynamicIcon
      name={iconName as IconName}
      className="h-5 w-5"
      aria-hidden="true"
      fallback={() => <Sparkles className="h-5 w-5" aria-hidden="true" />}
    />
  );
}
