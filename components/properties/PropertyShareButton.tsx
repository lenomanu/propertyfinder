"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function PropertyShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function shareProperty() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Unable to share property:", error);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      console.error("Unable to copy property link:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={shareProperty}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-live="polite"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      <span>{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
