"use client";

import { ReactNode } from "react";



type Props = {
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  // "compact" is used in the table row, "detailed" in the
  // agency details panel — same links, slightly different styling.
  variant?: "compact" | "detailed";
  emptyFallback?: ReactNode;
};

export function SocialLinks({
  instagram,
  tiktok,
  facebook,
  variant = "compact",
  emptyFallback = "—",
}: Props) {
  const hasLinks =
    instagram || tiktok || facebook;

  if (!hasLinks) {
    return <>{emptyFallback}</>;
  }

  const linkClassName =
    variant === "detailed"
      ? "text-primary underline underline-offset-4"
      : "text-muted-foreground underline underline-offset-4 hover:text-foreground";

  const gapClassName =
    variant === "detailed"
      ? "gap-4"
      : "gap-3";

  return (
    <div
      className={`flex flex-wrap ${gapClassName} text-sm`}
    >
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Instagram
        </a>
      )}

      {tiktok && (
        <a
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          TikTok
        </a>
      )}

      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Facebook
        </a>
      )}
    </div>
  );
}