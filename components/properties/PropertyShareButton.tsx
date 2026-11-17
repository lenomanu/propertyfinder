"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type PropertyShareButtonProps = {
  title: string;
  /** Same-origin URL that returns the listing’s primary photo. */
  shareImageUrl?: string;
};

export default function PropertyShareButton({
  title,
  shareImageUrl,
}: PropertyShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function loadShareImageFile(): Promise<File | null> {
    if (!shareImageUrl) return null;

    try {
      const response = await fetch(shareImageUrl);
      if (!response.ok) return null;

      const blob = await response.blob();
      const type = blob.type || "image/jpeg";
      const extension = type.includes("png")
        ? "png"
        : type.includes("webp")
          ? "webp"
          : "jpg";

      return new File([blob], `property.${extension}`, { type });
    } catch {
      return null;
    }
  }

  async function shareProperty() {
    const url = window.location.href;
    const text = title;
    const imageFile = await loadShareImageFile();

    if (navigator.share) {
      try {
        const shareData: ShareData = { title, text, url };
        if (
          imageFile &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ ...shareData, files: [imageFile] })
        ) {
          await navigator.share({ ...shareData, files: [imageFile] });
        } else {
          await navigator.share(shareData);
        }
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
